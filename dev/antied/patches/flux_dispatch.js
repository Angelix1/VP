import { instead } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findInReactTree } from "@vendetta/utils"
import { findByProps } from "@vendetta/metro"
import { React, FluxDispatcher } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { storage } from "@vendetta/plugin";

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByProps("getMessage", "getMessages");
const ChannelStore = findByProps("getChannel", "getDMFromUserId");

export default (editedMessageArray, deletedMessageArray) => instead("dispatch", FluxDispatcher, (args, originalFunc) => {
	const [event] = args;
	const type = event?.type;

	// Message Delete Patch
	if( type == "MESSAGE_DELETE" ) {

		const Channel = ChannelStore.getChannel(event?.channelId?.toString?.());
		const targetChannel = [ 1, 3 ];

		function handleDeletion(callback, that, callbackArgs, deletedArray) {

			const originalMessage = MessageStore.getMessage(event?.channelId, event?.id);

			console.log(originalMessage)

			const OMCheck1 = originalMessage?.author?.id;
			const OMCheck2 = originalMessage?.author?.username;
			const OMCheck3 = (!originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0);
			
			if (!OMCheck1 || !OMCheck2 || OMCheck3) return callback.apply(that, callbackArgs);

			if(storage?.switches?.ignoreBots && originalMessage?.author?.bot) return callback.apply(that, callbackArgs);

			if(
				(storage?.inputs?.ignoredUserList?.length > 0) &&
				storage.inputs.ignoredUserList?.some(user => 
					(user?.id == originalMessage?.author?.id) || (user.username == originalMessage.author.username) 
				)
			) return callback.apply(that, callbackArgs);

			callbackArgs[0] = {
				type: "MESSAGE_UPDATE",
				channelId: originalMessage?.channel_id || event?.channelId,
				message: { 
					...originalMessage,
					content: originalMessage?.content,
					type: 0,
					flags: 64,
					channel_id: originalMessage?.channel_id || event?.channelId,
					guild_id: ChannelStore?.getChannel(originalMessage?.channel_id)?.guild_id,
					timestamp: `${new Date().toJSON()}`,
					state: "SENT"
				}, 
				optimistic: false, 
				sendMessageOptions: {}, 
				isPushNotification: false,
			}

			deletedArray.push(event?.id || originalMessage?.id)

			return callback.apply(that, callbackArgs)
		}

		// Handling DMs
		if(targetChannel.some(x => x == Channel.type)) {
			if(!event.hasOwnProperty('guildId')) {

				if(deletedMessageArray?.includes(event?.id)) {
					deletedMessageArray = deletedMessageArray?.filter(item => item != event?.id);
					return originalFunc.apply(this, args)
				}

				args[0] = {
					type: "MESSAGE_CAT"
				};
				// console.log("Patch SKipped and Ignored\n\n")
				return originalFunc.apply(this, args)
			}

			if(deletedMessageArray?.includes(event?.id)) {
				deletedMessageArray = deletedMessageArray?.filter(item => item != event?.id);
				return originalFunc.apply(this, args)
			}

			return handleDeletion(originalFunc, this, args, deletedMessageArray)
		}

		// Handling Guild
		else {
			if(!event.guildId || !event.hasOwnProperty('guildId')) {

				if(deletedMessageArray?.includes(event?.id)) {
					deletedMessageArray = deletedMessageArray?.filter(item => item != event?.id);
					return originalFunc.apply(this, args)
				}

				args[0] = {
					type: "MESSAGE_CAT"
				};
				
				// console.log("Patch SKipped and Ignored\n\n")
				return originalFunc.apply(this, args)
			}

			if(deletedMessageArray?.includes(event?.id)) {
				deletedMessageArray = deletedMessageArray?.filter(item => item != event?.id);
				return originalFunc.apply(this, args)
			}

			return handleDeletion(originalFunc, this, args, deletedMessageArray)
		}
	}

	// Message Update Patch
	if( type == "MESSAGE_UPDATE" ) {
		// console.log(editedMessageArray)

		if(event?.removeHistory) return originalFunc.apply(this, args);

		if(event?.message?.author?.bot) return originalFunc.apply(this, args);

		const originalMessage = MessageStore.getMessage(event?.message?.channel_id, event?.message?.id);

		const OMCheck1 = originalMessage?.author?.id;
		const OMCheck2 = originalMessage?.author?.username;
		const OMCheck3 = (!originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0);
		
		if(!OMCheck1 || !OMCheck2 || OMCheck3) return originalFunc.apply(this, args);		

		const EmbedCheck1 = event?.message?.content == originalMessage?.content;
		const EmbedCheck2 = event?.message?.embeds.some(emb => 
        	(
            	emb?.url == originalMessage?.content || 
            	emb?.thumbnail?.url == originalMessage?.content ||
            	originalMessage?.content.includes(emb?.url) || 
            	originalMessage?.content.includes(emb?.thumbnail?.url)
         	)
        )

        const EmbedCheck3 = event?.message?.embeds?.size || event?.message?.embeds?.length;
        const EmbedCheck4 = originalMessage?.embeds?.size || originalMessage?.embeds?.length

		if(
			EmbedCheck1 || 
			EmbedCheck2 || 
			(!event?.message?.content && (EmbedCheck3 != EmbedCheck4)) 

		) return originalFunc.apply(this, args);

		if(
			(storage?.inputs?.ignoredUserList?.length > 0) &&
			storage.inputs.ignoredUserList?.some(user => 
				(user?.id == originalMessage?.author?.id) || (user.username == originalMessage.author.username) 
			)
		) return originalFunc.apply(this, args);

		let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";

		Edited = Edited + "\n\n";

		const newMsg = event?.message || originalMessage;
		let newMessageContent = `${originalMessage?.content}`

		if(storage?.switches?.addTimestampForEdits) {
			const now = Date.now()

			const timeRelative = `<t:${Math.abs(Math.round(now / 1000))}:R>`

			newMessageContent += `  (${timeRelative}) ${Edited}${event?.message?.content ?? ""}`;
		} 
		else {
			newMessageContent += `  ${Edited}${event?.message?.content ?? ""}`;
		}


		args[0] = {
			type: "MESSAGE_UPDATE",  
			message: {
				...newMsg,
				content: newMessageContent,
				guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
				edited_timestamp: "invalid_timestamp",
			},
		};  

		if(!editedMessageArray.some(IDs => (IDs == originalMessage?.id) || (IDs == event?.message?.id))) {
			editedMessageArray.push(originalMessage?.id || event?.message?.id);			
		}

		return originalFunc.apply(this, args);
	}


	// Default for other stuff types
	return originalFunc.apply(this, args)
})


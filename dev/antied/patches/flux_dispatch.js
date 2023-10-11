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

/*
type: {
	0: "GUILD_TEXT"
	1: "DM"
	2: "GUILD_VOICE"
	3: "GROUP_DM"
	4: "GUILD_CATEGORY"
	5: "GUILD_ANNOUNCEMENT"
	10: "ANNOUNCEMENT_THREAD"
	11: "PUBLIC_THREAD"
	12: "PRIVATE_THREAD"
	13: "GUILD_STAGE_VOICE"
	14: "GUILD_DIRECTORY"
	15: "GUILD_FORUM"
	16: "GUILD_MEDIA"
}

client = {
	DM: 1
	Guild: 1,2
}

otherClient = {
	DM: 1 
	Guild: 2
}

*/
		const Channel = ChannelStore.getChannel(event?.channelId?.toString?.());
		const targetChannel = [ 1, 3 ];

		function handleDeletion(callback, that, callbackArgs, deletedArray) {

			if(deletedArray?.includes(event?.id)) {

				deletedArray = deletedArray?.filter(item => item != event?.id);
				return callback.apply(that, callbackArgs)
			}

			const originalMessage = MessageStore.getMessage(event?.channelId, event?.id);

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
					state: "SENT",
					dumass: 99
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
			return handleDeletion(originalFunc, this, args, deletedMessageArray)
		}
	}

	// Message Update Patch
	if( type == "MESSAGE_UPDATE" ) {
		// console.log(event)

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

		args[0] = {
			type: "MESSAGE_UPDATE",  
			message: {
				...newMsg,
				content: `${originalMessage?.content}  ${Edited}${event?.message?.content ?? ""}`,
				guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
				edited_timestamp: "invalid_timestamp",
			},
		};  

		editedMessageArray.push(originalMessage?.id || event?.message?.id);

		return originalFunc.apply(this, args);
	}


	// Default for other stuff types
	return originalFunc.apply(this, args)
})









/*
{ 
	video: { 
		width: 1280,
		url: 'https://www.youtube.com/embed/FXiRm8KXwUE',
		height: 720 
	},
	url: 'https://www.youtube.com/watch?v=FXiRm8KXwUE',
	type: 'video',
	title: 'I Played 50+ Racing Games Nobody Ever Played',
	thumbnail: { 
		width: 1280,
		url: 'https://i.ytimg.com/vi/FXiRm8KXwUE/maxresdefault.jpg',
		proxy_url: 'https://images-ext-1.discordapp.net/external/rzWqXwLnpcOdzuuX75S8CfQNbEoyWB4_gKbv6Z0T3kA/https/i.ytimg.com/vi/FXiRm8KXwUE/maxresdefault.jpg',
		height: 720 
	},
	provider: { url: 'https://www.youtube.com', name: 'YouTube' },
	description: 'Diving into the deepest depths of Steam. The racing game category specifically. After over 2 months of digging through garbage, is there anything worth playing? You\'ll find out in this video\n\n\n[Spoilers] Links to games: https://docs.google.com/spreadsheets/d/1MJmop3UDgZUihvHHsIvuRAmmz-X8vdM82V425y_WYF8\n\nDiscord: https://discord.gg/8BAXvEAH6h\n\n0:...',
	color: 16711680,
	author: { 
		url: 'https://www.youtube.com/channel/UCcWlAZgbckzaKHFxChA8p9g',
		name: 'Sepi (SP4)' 
	} 
}
*/
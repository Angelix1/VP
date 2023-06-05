
import Settings from "./Settings";

import { before, after } from '@vendetta/patcher';
import { findByStoreName, findByProps } from '@vendetta/metro';
import { FluxDispatcher, moment } from "@vendetta/metro/common";
import { storage, manifest } from "@vendetta/plugin";

const MessageStore = findByProps('getMessage', 'getMessages');
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const Message = findByProps("startEditMessage")


let deletedMessages = {};
let EditedMessage = "`[ EDITED ]`\n\n";
let DeletedMessage = "`[ DELETED ]`";

// Essential to Remove keys from deletedMessages object 
function removeKey(key, obj) {
  let { [key]: foo, ...b} = obj;
  return b;
}


const DIE = {
  onLoad() {

    // patch for when editing own edited messages, it act like normal, instead of taking everything including the [EDITED] lol
    this.self = before('startEditMessage', Message, (args) => {
      const [channelId, messageId, msg] = args;
      const lats = msg.split(EditedMessage);
      args[2] = lats[lats.length - 1];
      return args;
    });
    
    // patch for the message
    this.messageLogger = before("dispatch", FluxDispatcher, (args) => {

      /* IDS
      "msg_normalEphemeral"
      "msg_useTimestamps
      "msg_AMPM"
      "msg_useDeleted"
      */

      storage["msg_normalEphemeral"] ??= false;
      storage["msg_useDeleted"] ??= false;

      storage["useTimestamps"] ??= false;
      storage["useAMPM"] ??= false;
  

      const [event] = args;
      let typ = event.type;
  
      // Patch for Deleted Message    
      if (typ === "MESSAGE_DELETE") { 
        
        const originalMessage = MessageStore.getMessage(args[0].channelId, args[0].id);
        

        // This is to fix the issue with needed to click multiple time to remove the ephemerals (if using Error Ephemeral, it'll still being annoying)
        if( deletedMessages[event.id] && deletedMessages[event.id]['modified'] == 2 ) {
          deletedMessages = removeKey(event.id, deletedMessages)
          return args;
        }
        
        // This is to fix the issue with when me(user who use the plugin) deletes a message, it got deleted anyway.
        // This code basically do, if the event fires 2nd time, return the saved message, cuz if i do return args, it'll delete, and if i do nothing it also delete.
        if( deletedMessages[event.id] && deletedMessages[event.id]['modified'] == 1) {
          deletedMessages[event.id]['modified'] = 2;
          return deletedMessages[event.id]["arg"];
        };
  
        // Check if we use [ DELETED ]
        if(Boolean(storage["msg_useDeleted"]) == true) {

          // Update the message rather than deleting it
          args[0] = {
            type: "MESSAGE_UPDATE",
            message: {
              ...originalMessage,
              edited_timestamp: "invalid_timestamp",
              content: `${originalMessage?.content} ${DeletedMessage}`,
              guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
            },
          };

          // add it to the object for earlier checks
          deletedMessages[event.id] = {
            arg: args,
            modified: 1
          };

          return args;
        }

        // Check if we use normal ephemral/ white ephemeral
        if(Boolean(storage["msg_normalEphemeral"]) == true) {

          // check if original message object 
          if (
            !originalMessage?.author?.id || 
            !originalMessage?.author?.username || 
            !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0
          ) return args;

          args[0] = {
            type: 'MESSAGE_UPDATE', 
            channelId: originalMessage?.channel_id,
            message: { 
              ...originalMessage,
              content: originalMessage?.content,
              type: 0, 
              flags: 64, 
              channel_id: originalMessage?.channel_id, 
              guild_id: ChannelStore?.getChannel(originalMessage?.channel_id)?.guild_id,
              timestamp: `${new Date().toJSON()}`,
              state: 'SENT',
            }, 
            optimistic: false, 
            sendMessageOptions: {}, 
            isPushNotification: false,
          }

          // Self Explanatory
          deletedMessages[event.id] = {
            arg: args,
            modified: 1
          };
  
          return args;
        }


        
        // i meann, this is Meqativ NoDelete as Default Logging type, cuz they asked for it

        // NO MODIFICATIONS AT ALL

        if (!event?.id || !event?.channelId) return;

        let message = storage["message"]?.trim?.() || "This message was deleted";

        // check if the user using timestamp
        if (storage["useTimestamps"]) {
          // ternary operator checks if the user use AM/PM or not
          message += ` (${moment().format(storage["useAMPM"] ? "hh:mm:ss.SS a" : "HH:mm:ss.SS")})`
        }
          
        args[0] = {
          type: "MESSAGE_EDIT_FAILED_AUTOMOD",
          messageData: {
            type: 1,
            message: {
              channelId: event.channelId,
              messageId: event.id,
            },
          },
          errorResponseBody: {
            code: 200000,
            message,
          },
        };

        // Self Explanatory
        deletedMessages[event.id] = {
          arg: args,
          modified: 1
        };

        return args;
      }

      // ===========
      // patch for Message Edit
      if (event.type === "MESSAGE_UPDATE") {
        // if bot return, and like who want to logs bot editing its damn msg          
        const originalMessage = MessageStore.getMessage(args[0].message?.channel_id, args[0].message?.id);

        if(args[0].message?.author?.bot || originalMessage?.author?.bot) return args;
        
        // check if original message object
        if (
          !originalMessage?.author?.id || 
          !originalMessage?.author?.username || 
          !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0
        ) return args;
  
        // check if content is the same, (ignores embeded links, cuz those are annoying to check)
        if(event?.message?.content == originalMessage.content) return args;
        
        args[0] = {
          type: "MESSAGE_UPDATE",  
          message: {
            edited_timestamp: "invalid_timestamp",
            content: `${originalMessage?.content}  ${EditedMessage}${event?.message?.content ?? ''}`,
            guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
          },
        };  
        return args;
      }
    });
  },
  onUnload() {
    this.self?.();
    this.messageLogger?.();
  },
  settings: Settings
}


export default DIE;

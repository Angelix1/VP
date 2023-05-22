import Settings from "./Settings";

import { before, after } from '@vendetta/patcher';
import { findByStoreName, findByProps } from '@vendetta/metro';
import { FluxDispatcher } from '@vendetta/metro/common';
import { useProxy } from "@vendetta/storage";
import { storage, manifest } from "@vendetta/plugin";

const MessageStore = findByProps('getMessage', 'getMessages');
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const Message = findByProps("startEditMessage")

let deletedMessages = {};
let EditedMessage = "`[ EDITED ]`\n\n";
let DeletedMessage = "`[ DELETED ]`";

const popline = (a) => { 
  // let bb = ((!a) ? ('='.repeat(40)) : (...a));
  console.log(a) 
}
function removeKey(key, obj) {
  let { [key]: foo, ...b} = obj;
  return b;
}

const DIE = {
  onLoad() {
    this.self = before('startEditMessage', Message, (args) => {
      const [channelId, messageId, msg] = args;
      const lats = msg.split(EditedMessage);
      args[2] = lats[lats.length - 1];
      return args;
    });
    
    this.messageLogger = before("dispatch", FluxDispatcher, (args) => {
      storage.useDelete ??= false;
  
      const [event] = args;
      let typ = event.type;
  
      if (typ === "MESSAGE_DELETE") { 
        
        const originalMessage = MessageStore.getMessage(args[0].channelId, args[0].id);
        // TIS CODE SUX
        if( deletedMessages[event.id] && deletedMessages[event.id]['modified'] == 2 ) {
          deletedMessages = removeKey(event.id, deletedMessages)
          return args;
        }
        
        if( deletedMessages[event.id] && deletedMessages[event.id]['modified'] == 1) {
          deletedMessages[event.id]['modified'] = 2;
          return deletedMessages[event.id]["arg"];
        };
  
        if(Boolean(storage.useDelete) == false) {

          if (
            !originalMessage?.author?.id || 
            !originalMessage?.author?.username || 
            !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0
          ) return args;
  
          args[0] = {
            type: 'MESSAGE_UPDATE', 
            channelId: originalMessage?.channel_id,
            message: { 
              id: originalMessage?.id, 
              type: 0, 
              flags: 64, 
              content: originalMessage?.content.toString(),
              channel_id: originalMessage?.channel_id, 
              guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
              author: originalMessage?.author,
              attachments: originalMessage?.attachments,
              embeds: originalMessage?.embeds,
              message_reference: originalMessage?.message_reference ?? {},
              pinned: false,
              mentions: [],
              mention_channels: [],
              mention_roles: [],
              mention_everyone: false,
              timestamp: `${new Date().toJSON()}`, 
              state: 'SENT',
              tts: false, 
            }, 
            optimistic: false, 
            sendMessageOptions: {}, 
            isPushNotification: false,
          }
  
          deletedMessages[event.id] = {
            arg: args,
            modified: 1
          };
  
          return args;
        }
        if(Boolean(storage.useDelete) == true) {
          // let noDel = {
          args[0] = {
            type: "MESSAGE_UPDATE",
            message: {
              ...originalMessage,
              edited_timestamp: "invalid_timestamp",
              content: `${originalMessage?.content} ${DeletedMessage}`,
              guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
              message_reference: originalMessage?.message_reference ?? {},
            },
            log_edit: false
          };

          deletedMessages[event.id] = {
            arg: args,
            modified: 1
          };

          return args;
          // return FluxDispatcher.dispatch(noDel);
        }
      }
        
      if (event.type === "MESSAGE_UPDATE") {
        if(args[0].message?.author?.bot) return args;
          
        const originalMessage = MessageStore.getMessage(args[0].message?.channel_id, args[0].message?.id);
                
        if (
          !originalMessage?.author?.id || 
          !originalMessage?.author?.username || 
          !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0
        ) return args;
  
        const MRF = (event?.message?.message_reference != undefined) ? 
          event?.message?.message_reference : 
          originalMessage?.message_reference;
  
        
        // check if this slow embed that trying to load preview
        if(event?.message?.embeds.some(x => originalMessage?.content?.includes(x?.url))) return args;
        
        args[0] = {
          type: "MESSAGE_UPDATE",  
          message: {
            ...originalMessage,
            type: originalMessage?.type,
            flags: originalMessage?.flags,
            message_reference: MRF,
            attachments: event?.message?.attachments ?? [],
            embeds: event?.message?.embeds ?? [],
            edited_timestamp: "invalid_timestamp",
            content: `${originalMessage?.content}  ${EditedMessage}${event?.message?.content ?? ''}`,
            guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
          },
          log_edit: false
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

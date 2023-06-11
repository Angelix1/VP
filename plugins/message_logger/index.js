import Settings from "./Settings";

import { before, after, instead } from '@vendetta/patcher';
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { FluxDispatcher, ReactNative, moment } from "@vendetta/metro/common";
import { storage, manifest } from "@vendetta/plugin";

const Message = findByProps("startEditMessage")
const MessageStore = findByProps('getMessage', 'getMessages');
const ChannelStore = findByProps("getChannel", "getDMFromUserId");

const { DCDChatManager } = ReactNative.NativeModules;


/* settings IDs and Vars
"deletedMessage"
"editedMessage"
"deletedMessageColorBackground"
"useBackgroundColor"
*/

let deletedMessageIds = [];


const DIE = {
  onLoad() {

    // patch for when editing own edited messages, it act like normal, instead of taking everything including the [EDITED] lol
    this.self = before('startEditMessage', Message, (args) => {
      
      let Edited = storage["editedMessage"] || "`[ EDITED ]`";
        Edited = Edited + '\n\n';

      const [channelId, messageId, msg] = args;
      const lats = msg.split(Edited);
      args[2] = lats[lats.length - 1];
      return args;
    });

    // patch for the message
    this.messageLogger = before("dispatch", FluxDispatcher, (args) => { 

      const [event] = args;
      let typ = event.type;
      
      // Patch for Deleted Message    
      if (typ === "MESSAGE_DELETE") {
        const Channel = ChannelStore.getChannel(event?.channelId);
        const originalMessage = MessageStore.getMessage(event?.channelId, event?.id);

        function UpdateMessage(update = false, org) {
          if(update) {
            return {
                type: 'MESSAGE_UPDATE', 
                channelId: org?.channel_id,
                message: org, 
                optimistic: false, 
                sendMessageOptions: {}, 
                isPushNotification: false,
            }
          } 
          else {
            return {
                type: 'MESSAGE_UPDATE', 
                channelId: org?.channel_id,
                message: { 
                  ...org,
            flags: 64,
            content: `${org?.content} `,
            channel_id: org?.channel_id, 
            guild_id: Channel?.guild_id,
            timestamp: `${new Date().toJSON()}`,
            state: 'SENT',
                }, 
                optimistic: true, 
                sendMessageOptions: {}, 
                isPushNotification: false,
            }
          }
        }

        
        // console.log(deletedMessageIds)
        
        // if DM
        if(Channel?.type == 1) {
          let find = deletedMessageIds.find(c => c.id == event.id)
          
          if(find.id == event.id) return args;
          //handle if it deleted
          args[0] = UpdateMessage(false, originalMessage)
          deletedMessageIds.push({ id: event?.id, flag: 1 });
          return args;
        } 
        else {
          // console.log(event)
          let find = deletedMessageIds?.find(c => c?.id == event?.id)
          
          if(find?.flag == 2) {
            return args;
          }

          if(event.hasOwnProperty('guildId')) {
            if(find?.flag == 1) {
              args[0] = UpdateMessage(true, originalMessage)
              deletedMessageIds?.map(x => { if(x?.id == event?.id) { x.flag = 2 } })
              return args;
            }

            if(find?.flag == 2) {
              return args;
            }

            args[0] = UpdateMessage(false, originalMessage)
            deletedMessageIds.push({ id: event?.id, flag: 1 });
            return args;
          }

          if(find?.flag == 1) {
            args[0] = UpdateMessage(true, originalMessage)
            deletedMessageIds?.map(x => { if(x?.id == event?.id) { x.flag = 2 } })
            return args;
          }

          if(find?.flag == 2 && (find.id == event.id)) {
            return args;
          }

          if(find.id != event.id) {
            args[0] = UpdateMessage(false, originalMessage)
            deletedMessageIds.push({ id: event?.id, flag: 1 });
            return args;
          }
        }
      }

      // ===========
      // patch for Message Edit
      if (typ === "MESSAGE_UPDATE") {

        const originalMessage = MessageStore.getMessage(event?.message?.channel_id, event?.message?.id);
        
        let Edited = storage["editedMessage"] || "`[ EDITED ]`";
        
        Edited = Edited + '\n\n';

        if(args[0].message?.author?.bot || originalMessage?.author?.bot) return args;
        
        if (
          !originalMessage?.author?.id || 
          !originalMessage?.author?.username || 
          !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0
        ) return args;
  
        // check if content is the same, (ignores embeded links, cuz those are annoying to check)
        if(event?.message?.content == originalMessage.content) return args;
        
        let newMsg = event?.message ?? originalMessage;
        args[0] = {
          type: "MESSAGE_UPDATE",  
          message: {
            ...newMsg,
            content: `${originalMessage?.content}  ${Edited}${event?.message?.content ?? ''}`,
            guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
            edited_timestamp: "invalid_timestamp",
          },
        };  
        return args;
      }

      // END
    });

    // patch for the color
    this.colorText = before("updateRows", DCDChatManager, (r) => {
      let rows = JSON.parse(r[1]);
      
      let savedColor = storage['deletedMessageColor'] || "E40303"; // Hex

      // check if its valid hex
      let HEX_regex = /[0-9A-Fa-f]{6}/;

      if(!savedColor.match(HEX_regex)) savedColor = "E40303";
      
      function transformObject(obj) {
        const compTypes = [
          'text',
          'heading',
          's',
          'u',
          'em',
          'strong',
          'list',
          'blockQuote'
        ];

        if (Array.isArray(obj)) {
          return obj.map(transformObject);
        } 
        else if (typeof obj === 'object' && obj !== null) {
          const { content, type, target, context, items } = obj;
          
          if(!compTypes.includes(type)) return obj;

          if (type === 'text' && content && content.length >= 1) {
      
            return {
                content: [{
                      content: content,
                      type: 'text'
                  }],
                target: 'usernameOnClick',
                type: 'link',
                context: {
                    username: 1,
                    medium: true,
                    usernameOnClick: {
                      action: '0',
                      userId: '0',
                      linkColor: ReactNative.processColor(`#${savedColor.toString()}`),
                      messageChannelId: '0'
                    }
                }
            };
          }

          const updatedContent = transformObject(content);
          const updatedItems = items ? items.map(transformObject) : undefined;

          if (updatedContent !== content || updatedItems !== items || !compTypes.includes(type)) {
            const updatedObj = { ...obj, content: updatedContent };
              
              if (type === 'blockQuote' && target) {
                  updatedObj.content = updatedContent;
                  updatedObj.target = target;
              }

              if (type === 'list') {
                if (updatedObj.hasOwnProperty('content')) {
                    delete updatedObj.content;
                }
              }

              if (items) {
                updatedObj.items = updatedItems;
              }

            return updatedObj;
          }
        }

        return obj;
      }
    
      rows.forEach((row) => {
        if(row.type != 1) return;

        if(!deletedMessageIds.find(c => c.id == row?.message?.id)) return row;

        let newRow = transformObject(row?.message?.content);

        row.message.content = newRow;
        row.message.edited = storage['deletedMessage'] || 'This message is deleted';

        let savedBGColor = storage['deletedMessageColorBackground'] || "FF2C2F";

        if(!savedBGColor.match(HEX_regex)) savedBGColor = "FF2C2F";

        let apl = `#${ savedBGColor.toString() }33`;
        let aplb = `#${ savedBGColor.toString() }CC`;

        if(Boolean(storage['useBackgroundColor'])) {
          row.backgroundHighlight = {
            backgroundColor: ReactNative.processColor(apl),
            gutterColor: ReactNative.processColor(aplb),
          };
        }

        return row;
      })

      r[1] = JSON.stringify(rows);
    });

  },
  onUnload() {
    this.self?.();
    this.colorText?.();
    this.messageLogger?.();
  },
  settings: Settings
}


export default DIE;

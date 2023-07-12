import Settings from "./Settings";

import { before, after, instead } from '@vendetta/patcher';
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { FluxDispatcher, ReactNative, React, moment } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets"
import { storage, manifest } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { Forms } from "@vendetta/ui/components"

const Message = findByProps("startEditMessage")
const MessageStore = findByProps('getMessage', 'getMessages');
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { getUser } = findByProps('getUser');
const Icon = findByName("Icon")

const { DCDChatManager } = ReactNative.NativeModules;
const { FormRow } = Forms


/* settings IDs and Vars
"deletedMessage"
"editedMessage"
"deletedMessageColorBackground"
"useBackgroundColor"

storage['customize'] = customization
storage['ignore'] = Ignore List
storage['showChanges'] = Patches
storage.ignoreBots = false

storage.users = []
*/

// Essential to Remove keys from deletedMessages object 
function removeKey(key, obj) {
  let { [key]: foo, ...b} = obj;
  return b;
}

let deletedMessageIds = {};
let editedMessageIds = [];

function makeDefaults(object, defaults) {
  if (object != undefined) {
    if (defaults != undefined) {
      for (const key of Object.keys(defaults)) {
        if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
          if (typeof object[key] !== "object") object[key] = {};
          makeDefaults(object[key], defaults[key]);
        } else {
          object[key] ??= defaults[key];
        }
      }
    }
  }
}


makeDefaults(storage, {
  deletedMessage: undefined,
  editedMessage: undefined,
  deletedMessageColorBackground: undefined,
  useBackgroundColor: false,
  customize: false,
  showChanges: false,
  ignore: false,
  ignoreBots: false,
  users: [],
  minimal: true,
})

let self;
let messageLogger;
let colorText;
let removeEditedHistory;


const DIE = {
  onLoad() {

    // patch for when editing own edited messages, it act like normal, instead of taking everything including the [EDITED] lol
    self = before('startEditMessage', Message, (args) => {
      
      let Edited = storage["editedMessage"] || "`[ EDITED ]`";
        Edited = Edited + '\n\n';

      const [channelId, messageId, msg] = args;
      const lats = msg.split(Edited);
      args[2] = lats[lats.length - 1];
      return args;
    });

    // patch for the message
    messageLogger = before("dispatch", FluxDispatcher, (args) => { 

      const [event] = args;
      let typ = event.type;
      
      // Patch for Deleted Message    
      if (typ === "MESSAGE_DELETE") {

        if( deletedMessageIds[event.id] && deletedMessageIds[event.id]['modified'] == 2 ) {
          deletedMessageIds = removeKey(event.id, deletedMessageIds)
          return args;
        }
        
        if( deletedMessageIds[event.id] && deletedMessageIds[event.id]['modified'] == 1) {
          deletedMessageIds[event.id]['modified'] = 2;
          return deletedMessageIds[event.id]["arg"];
        };


        // Continue if one of them enabled
        const originalMessage = MessageStore.getMessage(args[0].channelId, args[0].id);

        if( storage?.ignoreBots && originalMessage?.author?.bot ) {
          return args;
        }

        if( 
          storage?.users?.some(user => user?.id == originalMessage?.author?.id) || 
          storage?.users?.some(user => user?.username == originalMessage?.author?.username)
          ) {
          return args;
        }
  
        // check if original message object exist
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
        deletedMessageIds[event.id] = {
          arg: args,
          modified: 1
        };

        return args;

      }

      

      // patch for Message Edit
      if (typ === "MESSAGE_UPDATE") {

        // console.log(event)

        if(event?.removeHistory) {
          return args;
        }

        if( storage?.ignoreBots && event?.message?.author?.bot ) {
          return args;
        }

        if( 
          storage?.users?.some(user => user?.id == event?.message?.author?.id) || 
          storage?.users?.some(user => user?.username == event?.message?.author?.username)
          ) {
          return args;
        }

        const originalMessage = MessageStore.getMessage(event?.message?.channel_id, event?.message?.id);
        
        let Edited = storage["editedMessage"] || "`[ EDITED ]`";
        
        Edited = Edited + '\n\n';

        if(args[0].message?.author?.bot || originalMessage?.author?.bot) return args;
        
        if (
          !originalMessage?.author?.id || 
          !originalMessage?.author?.username || 
          !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0
        ) return args;
  
        if(event?.message?.content == originalMessage?.content) return args;
        
        let newMsg = event?.message || originalMessage;
        args[0] = {
          type: "MESSAGE_UPDATE",  
          message: {
            ...newMsg,
            content: `${originalMessage?.content}  ${Edited}${event?.message?.content ?? ''}`,
            guild_id: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id,
            edited_timestamp: "invalid_timestamp",
          },
        };  

        editedMessageIds.push(originalMessage?.id || event?.message?.id)
        return args;
      }

      // END
      return args;
    });

    // patch for the color
    if (!storage['minimal']) {
      colorText = before("updateRows", DCDChatManager, (r) => {
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
          if(row?.type == 1) {
            if(deletedMessageIds[row?.message?.id]) {
    
              let newRow = transformObject(row?.message?.content, savedColor);
      
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
            }
          }
        })

        r[1] = JSON.stringify(rows);
      });
    }

    // patch for removing edited message history
    removeEditedHistory = before("openLazy", ActionSheet, (ctx) => {
      const [component, args, actionMessage] = ctx
      if (args !== "MessageLongPressActionSheet") return;
      
      component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
          React.useEffect(() => () => { unpatch() }, [])

          let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children
          const message = msgProps?.props?.message ?? actionMessage?.message
          if (!buttons || !message) return;

          const originalMessage = MessageStore.getMessage(message.channel_id,message.id)

          if( editedMessageIds.includes(message?.id || originalMessage?.id) ) {
            buttons.unshift(
              <FormRow
                label="Remove EDITED Log History"
                leading={<Icon source={getAssetIDByName("ic_edit_24px")} />}
                onPress={() => {

                  let Edited = storage["editedMessage"] || "`[ EDITED ]`";
                    Edited = Edited + '\n\n';

                  const lats = message?.content?.split(Edited);
                  const targetMessage = lats[lats.length - 1];

                  // console.log(lats, targetMessage, editedMessageIds)

                  FluxDispatcher.dispatch({
                    type: "MESSAGE_UPDATE",
                    message: {
                      ...originalMessage,
                      content: `${targetMessage}`,
                      guild_id: ChannelStore.getChannel(originalMessage.channel_id).guild_id,
                    },
                    removeHistory: true
                  })

                  let inx = editedMessageIds.indexOf(originalMessage?.id || message?.id)

                  if(inx > -1 ) {
                    editedMessageIds.splice(inx, 1)
                  }

                  ActionSheet.hideActionSheet()
                  showToast("[Message Logger] Logs Removed", getAssetIDByName("ic_edit_24px"))
                }}
            />)
          }
        })
      })
    })

  },
  onUnload() {
    self?.();
    colorText?.();
    messageLogger?.();
    removeEditedHistory?.()
  },
  settings: Settings
}


export default DIE;

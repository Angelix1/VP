import Settings from "./Settings";

import { storage } from "@vendetta/plugin";

import {findByStoreName, findByProps} from "@vendetta/metro";
import {ReactNative, FluxDispatcher} from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";

const {DCDSoundManager} = ReactNative.NativeModules;
const SelectedChannelStore = findByStoreName("SelectedChannelStore");

const Warning = getAssetIDByName("ic_warning_24px");


/*
{ 
  id: newID, 
  url: '', 
  match: '', 
  regex: false, 
  flags: "gi" 
}
*/

// { soundId: 0, ready: false, duration: -1 }
let sounds = [];


// function onReaction(event) {
//   if (
//     (storage.allowReactions ?? true) &&
//     event.channelId == SelectedChannelStore.getChannelId() &&
//     (event.emoji.name == "🗿" || event.emoji.name.match(/.*?moy?ai.*?/i)) &&
//     !event.optimistic
//   ) {
//     playSound();
//   }
// }


const STATIC_AUDIO_REGEX = /((http(s)?\:\/\/)(((?!\?).)+\.(mp3|ogg|wav)))/i;


async function onMessage(event) {
    // console.log(event)
    // console.log(SelectedChannelStore.getChannelId())
  if (
    event.message.content && event.channelId == SelectedChannelStore.getChannelId() && 
    !event.message.state
  ) {

    let message = event.message;

    // console.log(message)

    for (const thing of storage.soundDatas) {
      // console.log(thing)

      if(thing?.url?.match(STATIC_AUDIO_REGEX)) {
  
        if (thing.regex) {
          /*
          try {
            
            const pattern = new RegExp(thing.match, thing.flags)

            let count = (message.content.match(pattern) ?? []).length;

            if (count > 0) {

              for (let i = 0; i < count; i++) {

                setTimeout(async () => {

                  if (thing.playing) {
                    if (thing.timeout != null) clearTimeout(thing.timeout);
                    
                    DCDSoundManager.stop(thing.id);
                    thing.timeout = false;
                  }

                  thing.playing = true;

                  await DCDSoundManager.play(thing.id);

                  thing.timeout = setTimeout(() => {
                    thing.playing = false;
                    DCDSoundManager.stop(thing.id);
                    thing.timeout = null;
                  }, thing.duration);
                }, i * 250);
              }
            }
            

          } 

          catch (e) {
            
            console.log(e)

            showToast(`Failed to use RegExp for ${thing.id}!`, Warning)
            continue;
          }
          */
        } 
        else {
          
          if (message.content.includes(thing.match)) {
            console.log(1)

            let prop = Object.assign({}, thing)

            const prepareSound = () =>
              new Promise((resolve) =>
                DCDSoundManager.prepare(thing.url, "notification", parseInt(thing.id), (_, meta) =>
                  resolve(meta)
                )
              )


            prepareSound().then((meta) => {

                prop.ready = true;
                prop.duration = meta.duration;
                prop.timeout = null;
                prop.playing = false;

            })
            .catch((c) => {
              showToast(`Failed to load url link for ${id}!`, Warning)
            })

            console.log(2)

            console.log(prop)      

            console.log(3)

            let parsedID = parseInt(prop.id)

            if (prop.playing) {
              if (prop.timeout != null) clearTimeout(prop.timeout);
              
              DCDSoundManager.stop(parsedID);
              prop.timeout = false;
            }

            console.log(4)

            prop.playing = true;

            await DCDSoundManager.play(parsedID;

            console.log(5)

            prop.timeout = setTimeout(() => {
              prop.playing = false;
              DCDSoundManager.stop(parsedID);
              prop.timeout = null;
            }, prop.duration);
          
            console.log(7)
          }
        }

      };
    }
  }
}


export default {
  onLoad: async () => {
    storage.soundDatas ??= [];


    FluxDispatcher.subscribe("MESSAGE_CREATE", onMessage);
    // FluxDispatcher.subscribe("MESSAGE_REACTION_ADD", onReaction);


  },
  onUnload: async () => {  
    FluxDispatcher.unsubscribe("MESSAGE_CREATE", onMessage);
    // FluxDispatcher.unsubscribe("MESSAGE_REACTION_ADD", onReaction);
  },
  settings: Settings
}


/*
export default {
  onLoad: () => {
    if (!soundPrepared) {
      prepareSound().then((meta: Record<string, number>) => {
        soundPrepared = true;
        SOUND_DURATION = meta.duration;
      });
    }
    FluxDispatcher.subscribe("MESSAGE_CREATE", onMessage);
    FluxDispatcher.subscribe("MESSAGE_REACTION_ADD", onReaction);
  },
  onUnload: () => {
    FluxDispatcher.unsubscribe("MESSAGE_CREATE", onMessage);
    FluxDispatcher.unsubscribe("MESSAGE_REACTION_ADD", onReaction);
  },
  settings: MoyaiSettings,
};
*/
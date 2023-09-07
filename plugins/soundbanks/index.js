import Settings from "./Settings";

import { storage } from "@vendetta/plugin";
import { findByStoreName } from "@vendetta/metro";
import { FluxDispatcher, ReactNative } from "@vendetta/metro/common";
import { logger } from "@vendetta";


const { DCDSoundManager } = ReactNative.NativeModules;
const selectedChannelStore = findByStoreName("SelectedChannelStore");


const staticAudioRegex = /((http(s)?\:\/\/)(((?!\?).)+\.(mp3|ogg|wav)))/i;

// const soundArray = [
//   {
//     sound_id: 123456789,
//     sound_name: 'Discordo',
//     sound_url: "https://discord.com/assets/ae7d16bb2eea76b9b9977db0fad66658.mp3",
//     sound_match: "coom",
//     sound_regex: null,
//     regex_flag: null,
//     repeat_sound: false,
//     use_regex: false
//   }
// ]


let wasPlayingSound = false;

storage.soundDatas ??= [];

const soundArray = storage.soundDatas;


const promiseSound = (SURL, SID) =>
  new Promise((resolve) =>
    DCDSoundManager.prepare(SURL, "notification", SID, (_, meta) =>
      resolve(meta)
    )
  );

function playSound(URL, ID, repeat = 1) {

  let soundDuration = undefined;
  const defaultDuration = 2_000;

  wasPlayingSound = true;
  promiseSound(URL, ID).then(async soundMeta => {
    soundDuration = soundMeta?.duration ?? defaultDuration;

    let loopPlays = false, loopTm = null;

    for (let i = 0; i < repeat; i++) {
      setTimeout(async () => {
        if (loopPlays) {
          loopPlays = false;
          DCDSoundManager.stop(ID)
          clearTimeout(loopTm)
        }
        loopPlays = true;

        await DCDSoundManager.play(ID)

        loopTm = setTimeout(() => {
          loopPlays = false
          DCDSoundManager.stop(ID)

          wasPlayingSound = false
          setTimeout(() => DCDSoundManager.release(ID), 100) // 100ms buffer to avoid crash, and i hate it.
        }, soundDuration)

      }, i * 400);
    }

  }).catch(err => {
    logger.log("[SOUNDBANKS] (playSound Func): " + err)
  })
}

function onMessage(event) {
  if (
    event.message.content && 
    event.channelId == selectedChannelStore.getChannelId() && 
    !event.message.state
  ) {

    const message = event.message;

    if (!wasPlayingSound) {

      const filtered = soundArray.filter(x => x?.sound_url?.match(staticAudioRegex));

      for (const data of filtered) {

        if (!data?.sound_id || !data?.sound_url) continue;

        if (!data?.use_regex && data?.sound_match && message.content.includes(data?.sound_match)) {

          playSound(data?.sound_url, data?.sound_id)
          break;
        }
        else if (data?.use_regex) {
          if (!data?.regex_flag || !data?.sound_regex) continue;
          
          const regex = new RegExp(data?.sound_regex, data?.regex_flag || "gi")
          if (regex.test(message.content)) {

            if (data?.repeat_sound) {
              const repeatCount = message?.content?.match?.(regex)?.length ?? null;
              playSound(data?.sound_url, data?.sound_id, repeatCount)
            }
            else {
              playSound(data?.sound_url, data?.sound_id)
            }
            break;
          }
          // continue;
        }
      }
    }
  }
}

export default {
  onLoad: async () => {
    storage.soundDatas ??= [];
    
    FluxDispatcher.subscribe("MESSAGE_CREATE", onMessage);
  },
  onUnload: async () => {  
    FluxDispatcher.unsubscribe("MESSAGE_CREATE", onMessage);
  },
  settings: Settings
}


import Settings from "./Settings";

import { storage } from "@vendetta/plugin";

import {findByStoreName, findByProps} from "@vendetta/metro";
import {ReactNative, FluxDispatcher} from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { DCDSoundManager } = ReactNative.NativeModules;
const SelectedChannelStore = findByStoreName("SelectedChannelStore");

const Warning = getAssetIDByName("ic_warning_24px");

const STATIC_AUDIO_REGEX = /((http(s)?\:\/\/)(((?!\?).)+\.(mp3|ogg|wav)))/i;

// const SoundArray = [
//   {
//     sound_id: 123456789,
//     sound_url: "https://discord.com/assets/ae7d16bb2eea76b9b9977db0fad66658.mp3",
//     sound_match: "coom",
//     sound_regex: null,
//     regex_flag: null,
//     use_regex: false
//   }
// ]

let wasPlayingSound = false;

storage.soundDatas ??= [];

const SoundArray = storage.soundDatas;


const promiseSound = (SURL, SID) =>
  new Promise((resolve) =>
    DCDSoundManager.prepare(SURL, "notification", SID, (_, meta) =>
      resolve(meta)
    )
  );

function PlaySound(URL, ID, repeat = 1) {

  let SoundDuration = undefined;

  wasPlayingSound = true;
  promiseSound(URL, ID).then(async soundMeta => {
    SoundDuration = soundMeta.duration

    let loopPlays = false, loopTm = null;

    for(let i = 0; i < repeat; i++) {
      setTimeout(async () => {
        if(loopPlays) {
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
        }, SoundDuration)

      }, i * 400);
    }

  }).catch(err => {
    alert('[SOUNDBANKS] ERROR!!! CHECK DEBUG LOGS')
    console.log(err)

  })
}

function onMessage(event) {
  if (
    event.message.content && 
    event.channelId == SelectedChannelStore.getChannelId() && 
    !event.message.state
  ) {

    const message = event.message;

    if(!wasPlayingSound) {

      const Filtered = SoundArray.filter(x => x?.sound_url?.match(STATIC_AUDIO_REGEX));

      for(let data of Filtered) {

        if(!data?.sound_id || !data?.sound_url) continue;

        if(!data?.use_regex && data?.sound_match && message.content.includes(data?.sound_match)) {

          PlaySound(data?.sound_url, data?.sound_id)
          break;
        }
        else if(data?.use_regex) {
          if(!data?.regex_flag || !data?.sound_regex) continue;
          const Regex = new RegExp(data?.sound_regex, data?.regex_flag || 'gi')
          if(Regex.test(message.content)) {

            if(data?.repeat_sound) {
              const RepeatCount = message?.content?.match?.(Regex)?.length ?? null;
              PlaySound(data?.sound_url, data?.sound_id, RepeatCount)
            }
            else {
              PlaySound(data?.sound_url, data?.sound_id)
            }
            break;
          }
          continue;
        }
      }
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

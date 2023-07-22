import { before, after } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findByProps, findByName } from "@vendetta/metro"
import { React, ReactNative, constants as Constants, clipboard } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"
import { storage } from "@vendetta/plugin";

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const Navigation = findByProps("push", "pushLazy", "pop")
const DiscordNavigator = findByProps("getRenderCloseButton")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator
const { FormRow, FormIcon } = Forms

const targetIcon = <FormIcon style={{ opacity: 1 }} source={getAssetIDByName("copy")} />;

// Functions
function makeDefaults(object, defaults): void {
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
  bool: {
    copy_no_share: false,
    lpm_qol: false,
  },
  settings: {
    patch: false
  }
})


import Settings from "./pages/Settings";

let patch = [];

const Utils = {
  onLoad() {
    storage.bool.copy_no_share ??= false;
    storage.bool.lpm_qol ??= false;


    if (storage?.bool?.copy_no_share) {
      patch.push(
        before("openLazy", ActionSheet, ([component, key]) => {
          if (key !== "MediaShareActionSheet") return;
          component.then((instance) => {
            const unpatchInstance = after("default", instance, ([{ syncer }], res) => {
              React.useEffect(() => unpatchInstance(), []);

              let source = syncer.sources[syncer.index.value];
              if (Array.isArray(source)) source = source[0];

              const url = source.sourceURI ?? source.uri;
              const rows = res?.props?.children?.props?.children;

              let share = rows.find(x => x.props?.label?.toLowerCase() == 'share');

              rows[rows.indexOf(share)] = (
                <FormRow 
                  leading={targetIcon}
                  label="Copy Image Link"
                  onPress={() => {
                    ActionSheet.hideActionSheet()
                    clipboard.setString(url)
                    showToast("Image Url Copied", getAssetIDByName("toast_copy_link"))
                  }}
                />
              );
            })
          })
        })
      )
    }

    if (storage?.bool?.lpm_qol) {
      patch.push(
        before("openLazy", ActionSheet, (ctx) => {
          const [component, args, actionMessage] = ctx;
          if (args !== "MessageLongPressActionSheet") return
          component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
              React.useEffect(() => () => { unpatch() }, [])

              let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children
              const message = msgProps?.props?.message ?? actionMessage?.message
              if (!buttons || !message) return;

              let mention = buttons.find(b => b?.props?.message?.toLowerCase() == 'mention');

              if (mention) {
                delete buttons[buttons.indexOf(mention)]
              }

              let datas = [
                {
                  label: "Copy User's Id",
                  subLabel: 'Result: <Some ID>',
                  icon: 'ic_copy_id',
                  callback: () => {
                    ActionSheet.hideActionSheet()
                    clipboard.setString(message?.author?.id ?? '')
                    showToast("Copied User's ID to clipboard", getAssetIDByName("toast_copy_link"))
                  }
                },
                {
                  label: "Copy User's Mention",
                  subLabel: 'Result: <Mention>',
                  icon: 'ic_copy_id',
                  callback: () => {
                    ActionSheet.hideActionSheet()
                    clipboard.setString(`<@${message?.author?.id ?? ''}>`)
                    showToast("Copied User's Mention to clipboard", getAssetIDByName("toast_copy_link"))
                  }
                },
                {
                  label: "Copy User's Id and Mention",
                  subLabel: 'Result: <Some ID> <Mention>',
                  icon: 'ic_copy_id',
                  callback: () => {
                    ActionSheet.hideActionSheet()
                    clipboard.setString(`${message?.author?.id ?? ''} <@${message?.author?.id ?? ''}>`)
                    showToast("Copied User to clipboard", getAssetIDByName("toast_copy_link"))
                  }
                },
              ]

              let btn = datas.map(data => {
                return (<>
                  <FormRow 
                    label={data.label}
                    subLabel={data.subLabel}
                    leading={
                      <FormIcon style={{opacity: 1}}source={getAssetIDByName(data.icon)}/>
                    }
                    onPress = {data.callback}
                  /> 
                </>)
              })

              buttons.unshift(btn)

            })
          })
        })
      )
    }
  },
  onUnload() {
    patch.forEach(p => p?.());
  },
  settings: Settings
}

export default Utils;
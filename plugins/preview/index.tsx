import { before, after } from "@vendetta/patcher"
import { find, findByProps, findByStoreName, findByName } from "@vendetta/metro"
import { findInReactTree } from "@vendetta/utils"
import { NavigationNative, React, ReactNative, constants as Constants, clipboard } from "@vendetta/metro/common"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { showToast } from "@vendetta/ui/toasts"
import { General } from "@vendetta/ui/components"


// External Components
import ServerData from "./serverData";

// Types
type Sticker = {
  id: string
  name: string
  tags: string
  type: number
  format_type: number
  description: string
  asset: string
  available: boolean
  guild_id: string
}

type EmojNode = {
  src: string,
  alt: string,
  id: string
}

const MessageEmojiActionSheet = findByProps("GuildDetails");
const GuildStore = findByStoreName("GuildStore")
const UserSettingsProtoStore = findByStoreName("UserSettingsProtoStore")
const StickerUtils = findByProps("favoriteSticker", "unfavoriteSticker")
const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const { default: ActionSheet } = find(m => m.default?.render?.name === "ActionSheet")
const { hideActionSheet } = findByProps("hideActionSheet")
const { downloadMediaAsset } = findByProps("downloadMediaAsset")
const { openURL } = findByProps("openURL", "openDeeplink");
const { default: Button, ButtonColors, ButtonLooks, ButtonSizes } = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");

const DiscordNavigator = findByProps("getRenderCloseButton")
const Navigation = findByProps("push", "pushLazy", "pop")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator

const { ScrollView, View, Text, TouchableOpacity, TextInput } = General;
const style = { marginBottom: 10 }

let patches = []

export default {
    onLoad: () => {

      // Patch Emojis
      patches.push(
        after("default", MessageEmojiActionSheet, ([{ emojiNode }], res) => {
          if (!emojiNode.src) return;

          const EmojiDetails = res?.props?.children?.props?.children?.props?.children

          const unpatchEmojiDetails = after("type", EmojiDetails, ([{ emojiNode }], rest) => {
            React.useEffect(() => () => { unpatchEmojiDetails() }, [])
            
            let filter = rest?.props?.children[4];
            if(!filter) return console.log('[NULL]');
            
            let data = filter?.props?.children[1]?.props?.guild;
            // console.log(data)
            if(!data) return;

            let btndata = [
            /*
              {
                text:,
                callback: () => {}
              }
            */
            ];

            let buttons = btndata.map(({ text, callback }) =>
              <Button
                color={ButtonColors.BRAND}
                text={text}
                size={ButtonSizes.SMALL}
                onPress={callback}
                style={{ marginTop: ReactNative.Platform.select({ android: 12, default: 16 }) }}
              />
            );

            buttons.unshift(<>
              <Button
                color={ButtonColors.BRAND}
                size={ButtonSizes.SMALL}
                text="Preview Server"
                onPress={() => {
                  LazyActionSheet.hideActionSheet() 
                  const navigator = () => (
                    <Navigator
                        initialRouteName="Page"
                        goBackOnBackPress
                        screens={{
                            Page: {
                              title: "Server Information",
                              headerLeft: getRenderCloseButton(() => Navigation.pop()),
                              render: () => <ServerData guild={data}/>
                            }
                        }}
                    />
                  )
                  Navigation.push(navigator)
                  
                }}
                style={{ marginTop: ReactNative.Platform.select({ android: 12, default: 16 }) }}
              />
            </>)

            rest.props?.children?.push(...buttons)
          })
        })

      )

      // Patch Stciker
      patches.push(
        before("render", ActionSheet, ([props]) => {
          const Sheet = findInReactTree(props, x => Array.isArray(x?.children))            
          const sticker = findInReactTree(props, x => typeof x?.sticker === "object" && x?.sticker?.hasOwnProperty("guild_id"))?.sticker as Sticker
          if (!Sheet || !sticker) return;

          // console.log(Sheet.children[4])

          let filter = Sheet.children[3];
          if(!filter) return console.log('[NULL]');
          
          let data = filter?.props?.children[1]?.props?.guild;
          // console.log(data)
          if(!data) return;

          let btndata = [
            /*
            {
              text:,
              callback: () => {}
            }
            */
          ];

          let buttons = btndata.map(({ text, callback }) =>
            <Button
              color={ButtonColors.BRAND}
              text={text}
              size={ButtonSizes.SMALL}
              onPress={callback}
              style={{ marginTop: ReactNative.Platform.select({ android: 12, default: 16 }) }}
            />
          );

          buttons.unshift(<>
            <Button
              color={ButtonColors.BRAND}
              size={ButtonSizes.SMALL}
              text="Preview Server"
              onPress={() => { 
                LazyActionSheet.hideActionSheet() 
                const navigator = () => (
                  <Navigator
                      initialRouteName="Page"
                      goBackOnBackPress
                      screens={{
                          Page: {
                            title: "Server Information",
                            headerLeft: getRenderCloseButton(() => Navigation.pop()),
                            render: () => <ServerData guild={data}/>
                          }
                      }}
                  />
                )
                Navigation.push(navigator)
                
              }}
              style={{ marginTop: ReactNative.Platform.select({ android: 12, default: 16 }) }}
            />
          </>)

          Sheet?.children?.push?.(...buttons)
        })
      )

    },
    onUnload: () => {        
        for (const unpatch of patches) unpatch()
    },
    // settings: Settings
}

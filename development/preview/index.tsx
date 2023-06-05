import { before, after } from "@vendetta/patcher"
import { findByProps, findByName } from "@vendetta/metro"
import { React, ReactNative, constants as Constants, clipboard } from "@vendetta/metro/common"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { showToast } from "@vendetta/ui/toasts"

const MessageEmojiActionSheet = findByProps("GuildDetails");
const { openURL } = findByProps("openURL", "openDeeplink");
const { default: Button, ButtonColors, ButtonLooks, ButtonSizes } = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");

const unpatch = after("default", MessageEmojiActionSheet, ([{ emojiNode }], res) => {
  // console.log(res,emojiNode)
  if (!emojiNode.src) return;

  const EmojiDetails = res?.props?.children?.props?.children?.props?.children
  const unpatchEmojiDetails = after("type", EmojiDetails, ([{ emojiNode }], rest) => {
    React.useEffect(() => () => { unpatchEmojiDetails() }, [])
    
    let filter = rest?.props?.children[4];
    if(!filter) return console.log('[NULL]');
    
    let data = filter?.props?.children[1]?.props?.guild;
    if(!data) return;

    let btndata = [
      {
        text: "Preview Server",
        callback: () => { 
          openURL( `https://angelw.cyclic.app/guild/${data?.id}` ) 
        }
      },
      {
        text: "Copy Preview Server Url",
        callback: () => { 
          clipboard.setString(`https://angelw.cyclic.app/guild/${data?.id}`);
          showToast("Copied Server ID to clipboard", getAssetIDByName("toast_copy_link"));
        }
      },
      {
        text: "Copy Server Id",
        callback: () => { 
          clipboard.setString(data?.id);
          showToast("Copied Server ID to clipboard", getAssetIDByName("toast_copy_link"));
        }
      }
    ]
    let buttons = btndata.map(({ text, callback }) =>
      <Button
        color={ButtonColors.BRAND}
        text={text}
        size={ButtonSizes.SMALL}
        onPress={callback}
        style={{ marginTop: ReactNative.Platform.select({ android: 12, default: 16 }) }}
      />
    );

     rest.props?.children?.push(...buttons)
  })
})

export const onUnload = () => unpatch()

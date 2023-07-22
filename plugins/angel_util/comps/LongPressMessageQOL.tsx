import { before, after } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findByProps as getByProps, findByName } from "@vendetta/metro"
import { React, ReactNative, constants as Constants, clipboard } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"
import { storage } from "@vendetta/plugin";

const ActionSheet = getByProps("openLazy", "hideActionSheet")
const Navigation = getByProps("push", "pushLazy", "pop")
const DiscordNavigator = getByProps("getRenderCloseButton")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator
const { FormRow, FormIcon } = Forms

export default [
    storage.bool.lpm_qol && before("openLazy", ActionSheet, (ctx) => {
        const [component, args, actionMessage] = ctx;
        if (args !== "MessageLongPressActionSheet") return
        component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
                React.useEffect(() => () => { unpatch() }, [])
                
                let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children
                const message = msgProps?.props?.message ?? actionMessage?.message
                if (!buttons || !message) return;

                let mention = buttons.find(b => b?.props?.message?.toLowerCase() == 'mention');

                if(mention) {
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
                            leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName(data.icon)} />}
                            onPress={data.callback}
                        />
                    </>)
                })

                buttons.unshift(btn)
            })
        })
    })

]
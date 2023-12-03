import { makeDefaults } from "./util";
import Settings from "./Settings";

import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";
import updateRowsPatch from "./patches/update_rows";
import createMessageRecord from "./patches/createMessageRecord";
import messageRecordDefault from "./patches/messageRecordDefault";
import updateMessageRecord from "./patches/updateMessageRecord";

import { before, after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { React, ReactNative, FluxDispatcher, i18n } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import { storage } from "@vendetta/plugin";
import { findByProps } from '@vendetta/metro';
import { Forms } from "@vendetta/ui/components";

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByProps("getMessage", "getMessages");
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const ChannelMessages = findByProps("_channelMessages");
const { FormRow, FormIcon } = Forms

makeDefaults(storage, {
    switches: {
        customizeable: false,
        useBackgroundColor: false,
        ignoreBots: false,
        minimalistic: true,
        alwaysAdd: false,
        darkMode: true,
        removeDismissButton: false,
        addTimestampForEdits: false,
        timestampStyle: 'R',
    },
    colors: {
        textColor: "#E40303",
        backgroundColor: "#FF2C2F",
        backgroundColorAlpha: "33",
        gutterColor: "#FF2C2F",
        gutterColorAlpha: "CC",
    },
    inputs: {
        deletedMessageBuffer: "This message is deleted",
        editedMessageBuffer: "`[ EDITED ]`",
        ignoredUserList: []
    }
})

let patches = [];

let deletedMessageArray = {};

export default {
    onLoad: () => {
        patches.push(
            fluxDispatchPatch(deletedMessageArray),
            updateRowsPatch(deletedMessageArray),
            selfEditPatch(),
            createMessageRecord(),
            messageRecordDefault(),
            updateMessageRecord(),

            before("openLazy", ActionSheet, ([component, args, actionMessage]) => {
                const message = actionMessage?.message;

                if (args !== "MessageLongPressActionSheet" || !message) return;

                component.then((instance) => {
                    const unpatch = after("default", instance, (_, comp) => {
                        React.useEffect(() => () => { unpatch() }, []);

                        const buttons = findInReactTree(comp, (x) => x?.[0]?.type?.name === "ButtonRow");
                        if (!buttons) return comp;
                        
                        const position = Math.max(buttons.findIndex((x) => x.props.message === i18n.Messages.MESSAGE_ACTION_REPLY), 0)
                        
                        const originalMessage = MessageStore.getMessage(message.channel_id, message?.id)

                        const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        const escapedBuffer = escapeRegex(storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`")

                        const separator = new RegExp(escapedBuffer, 'gmi');
                        const checkIfBufferExist = separator.test(message.content);

                        if(checkIfBufferExist) {
                            const buttons = findInReactTree(comp, x => x?.[0]?.type?.name === "ButtonRow")
                            if (!buttons) return;

                            buttons.splice(position, 0, (
                                <FormRow
                                    label="Remove Edit History"
                                    subLabel={storage?.switches?.alwaysAdd ? '(Added by alwaysAdd option)' : undefined}
                                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_edit_24px")} />}
                                    onPress={() => {
                                        let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
                                        Edited = Edited + "\n\n";                                    

                                        const lats = message?.content?.split(Edited);
                                        const targetMessage = lats[lats.length - 1];

                                        FluxDispatcher.dispatch({
                                            type: "MESSAGE_UPDATE",
                                            message: {
                                                ...originalMessage,
                                                content: `${targetMessage}`,
                                                guild_id: ChannelStore.getChannel(originalMessage.channel_id).guild_id,
                                            },
                                            otherPluginBypass: true
                                        })

                                        ActionSheet.hideActionSheet()
                                        showToast("[ANTI ED] History Removed", getAssetIDByName("ic_edit_24px"))
                                    }
                                }/>
                            ))
                        }
                        
                    })
                })
// End
            })
        );
    },
    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        }

        for (const channelId in ChannelMessages._channelMessages) {
            for (const message of ChannelMessages._channelMessages[channelId]._array) {
                message.was_deleted && FluxDispatcher.dispatch({
                    type: "MESSAGE_DELETE",
                    id: message.id,
                    channelId: message.channel_id,
                    otherPluginBypass: true,
                });
            }
        }
    },
    settings: Settings
}
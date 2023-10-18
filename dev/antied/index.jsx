import { makeDefaults } from "./util";
import Settings from "./Settings";

import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";
import updateRowsPatch from "./patches/update_rows";

import { before, after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { React, FluxDispatcher } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import { storage } from "@vendetta/plugin";
import { findByProps } from '@vendetta/metro';
import { Forms } from "@vendetta/ui/components";

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByProps("getMessage", "getMessages");
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
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
        addTimestampForEdits: false
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

let editedMessageArray = [];
let deletedMessageArray = [];

export default {
    onLoad: () => {
        patches.push(
            fluxDispatchPatch(editedMessageArray, deletedMessageArray),
            selfEditPatch(editedMessageArray),
            updateRowsPatch(deletedMessageArray),

            before("openLazy", ActionSheet, ([component, args, actionMessage]) => {
                const message = actionMessage?.message;

                if (args !== "MessageLongPressActionSheet" || !message) return;

                component.then((instance) => {
                    const unpatch = after("default", instance, (_, comp) => {
                        React.useEffect(() => () => { unpatch() }, []);

                        const buttons = findInReactTree(comp, (x) => x?.[0]?.type?.name === "ButtonRow");
                        if (!buttons) return comp;

                        
                        const originalMessage = MessageStore.getMessage(message.channel_id, message?.id)

                        if(storage?.switches?.alwaysAdd || editedMessageArray.includes(message?.id) || editedMessageArray.includes(originalMessage?.id) ) {
                            buttons.unshift(
                                <FormRow
                                label="Remove Edit History"
                                subLabel={storage?.switches?.alwaysAdd ? '(Added by alwaysAdd option)' : ''}
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
                                        removeHistory: true
                                    })

                                    editedMessageArray = editedMessageArray.filter(data => data != message?.id)

                                    ActionSheet.hideActionSheet()
                                    showToast("[ANTI ED] History Removed", getAssetIDByName("ic_edit_24px"))
                                }
                            }/>
                            )
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
    },
    settings: Settings
}

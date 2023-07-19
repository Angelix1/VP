import { find, findByProps } from "@vendetta/metro";
import { constants, clipboard, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showInputAlert } from "@vendetta/ui/alerts";


const LazyActionSheet = findByProps("openLazy", "hideActionSheet");
const { downloadMediaAsset } = findByProps("downloadMediaAsset");

const { default: ActionSheet } = find(m => m.default?.render?.name === "ActionSheet");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const { ActionSheetTitleHeader, ActionSheetCloseButton } = findByProps("ActionSheetTitleHeader");
const { default: Button, ButtonColors, ButtonLooks, ButtonSizes } = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");
const { FormDivider, FormIcon } = Forms;

// ext
import {showAddToServerActionSheet} from "./addToServerSheet"


export const showOptions = (data, guild) => LazyActionSheet.openLazy(
    new Promise(r => r({ default: Options })), 
    "ShowOptions",
    { data: data, guild: guild }
);

export default function Options({ data, guild }) {
    let AddToServer = {
        text: "Add to Server",
        callback: () => showAddToServerActionSheet(data)
    };

    let datas = [
        {
            text: "Copy URL to clipboard",
            callback: () => {
                clipboard.setString(data.url);
                LazyActionSheet.hideActionSheet();
                showToast(`Copied ${data.name}'s URL to clipboard`, getAssetIDByName("ic_copy_message_link"));
            }
        },
        {
            text: `Save image to ${ReactNative.Platform.select({ android: "Downloads", default: "Camera Roll" })}`,
            callback: () => {
                downloadMediaAsset(data.url, !data.url.includes(".gif") ? 0 : 1);
                LazyActionSheet.hideActionSheet();
                showToast(`Saved ${data.name}'s image to ${
                    ReactNative.Platform.select({ android: "Downloads", default: "Camera Roll" })
                }`, getAssetIDByName("toast_image_saved"));
            }
        }
    ]

    if(data.type == 'emoji') {
        datas.unshift(AddToServer)
    }

    return (<>
        <ActionSheet scrollable>
            <ActionSheetTitleHeader
                title={ data.name || "Options"}
                leading={<FormIcon
                    style={{ marginRight: 12 }}
                    source={getAssetIDByName('ic_forum_channel_list_view_24px')}
                    disableColor
                />}
                trailing={<ActionSheetCloseButton
                    onPress={() => LazyActionSheet.hideActionSheet()}
                />}
            />
            <BottomSheetFlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
                data={datas}
                renderItem={({ item }) => {
                    return (<>
                        <Button
                            color={ButtonColors.BRAND}
                            size={ButtonSizes.SMALL}
                            text={item.text}
                            onPress={item.callback}
                            style={{ margin: ReactNative.Platform.select({ android: 12, default: 16 }) }}
                        />
                    </>)
                }}
                ItemSeparatorComponent={FormDivider}
                keyExtractor={x => x.id}
            />
        </ActionSheet>
    </>)
};
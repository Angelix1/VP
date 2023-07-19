import { find, findByProps } from "@vendetta/metro";
import { constants, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import AddToServer from "./addToServer";

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const { default: ActionSheet } = find(m => m.default?.render?.name === "ActionSheet");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const { ActionSheetTitleHeader, ActionSheetCloseButton } = findByProps("ActionSheetTitleHeader");
const { FormDivider, FormIcon } = Forms;

const GuildStore = findByProps("getGuilds");
const PermissionsStore = findByProps("can", "_dispatcher");

type EMOK = {
    url: string,
    name: string,
    type: string
}

// function to show the sheet
export const showAddToServerActionSheet = (emoji) => LazyActionSheet.openLazy(
    new Promise(r => r({ default: AddToServerActionSheet })), 
    "AddToServerActionSheet", 
    { emoji: emoji }
);

// The sheet itself
export default function AddToServerActionSheet({ emoji }: { emoji: EMOK }) {
    
    const guilds = Object.values(GuildStore.getGuilds()).filter((guild) =>
        PermissionsStore.can(constants.Permissions.MANAGE_GUILD_EXPRESSIONS, guild)
    );

    return (
        <ActionSheet scrollable>
            <ActionSheetTitleHeader
                title={`Stealing ${emoji.name}`}
                leading={<FormIcon
                    style={{ marginRight: 12 }}
                    source={{ uri: emoji.url }}
                    disableColor // It actually does the opposite
                />}
                trailing={<ActionSheetCloseButton
                    onPress={() => LazyActionSheet.hideActionSheet()}
                />}
            />
            <BottomSheetFlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
                data={guilds}
                renderItem={({ item }) => (
                    <AddToServer
                        guild={item}
                        emoji={emoji}
                    />
                )}
                ItemSeparatorComponent={FormDivider}
                keyExtractor={x => x.id}
            />
        </ActionSheet>
    )
};

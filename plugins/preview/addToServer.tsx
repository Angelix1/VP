import { findByName, findByProps } from "@vendetta/metro";
import { showInputAlert } from "@vendetta/ui/alerts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";

const { default: GuildIcon, GuildIconSizes } = findByProps("GuildIconSizes");
const Icon = findByName("Icon");
const { FormRow } = Forms;

const Emojis = findByProps("uploadEmoji");
const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

type EMOK = {
    url: string,
    name: string,
    type: string
}

function fetchImageAsDataURL(url: string, callback: (dataUrl: string) => void) {
    // Fetch url
    fetch(url).then((resp) => {
        // Get it as a blob
        resp.blob().then((blob) => {
            // Turn it into a data URL
            const reader = new FileReader();
            reader.readAsDataURL(blob)
            // Called when data URL is ready
            reader.onloadend = () => {
                callback(reader.result as string)
            }
        })
    })
}


export default function AddToServer({ guild, emoji }: { guild: any, emoji: EMOK }) {
    return (<FormRow
        leading={
            <GuildIcon
                guild={guild}
                size={GuildIconSizes.MEDIUM}
                animate={false}
            />
        }
        label={guild.name}
        trailing={<Icon source={getAssetIDByName("ic_add_24px")} />}
        onPress={() => {
        showInputAlert({
            title: "Emoji name",
            initialValue: emoji.name,
            placeholder: "bleh",
            onConfirm: (name) => {
                // Fetch image
                fetchImageAsDataURL(emoji.url, (dataUrl) => {
                    // Upload it to Discord
                    Emojis.uploadEmoji({
                        guildId: guild.id,
                        image: dataUrl,
                        name: name,
                        roles: undefined
                    }).then(() => {
                        // Let user know it was added
                        showToast(`Added ${emoji.name} ${(emoji.name !== name) ? `as ${name} ` : ""}to ${guild.name}`, getAssetIDByName("Check"));
                    }).catch((e) => {
                        showToast(e.body.message, getAssetIDByName("Small"))
                    });
                });
            },
            confirmText: `Add to ${guild.name}`,
            confirmColor: 'brand',
            cancelText: "Cancel"
        })
        // Close the sheet
        LazyActionSheet.hideActionSheet();
    }}
    />)
}
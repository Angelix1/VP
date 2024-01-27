import { makeDefaults, colorConverter, setOpacity } from "./util";
import Settings from "./Settings";

import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";
import updateRowsPatch from "./patches/update_rows";
import createMessageRecord from "./patches/createMessageRecord";
import messageRecordDefault from "./patches/messageRecordDefault";
import updateMessageRecord from "./patches/updateMessageRecord";

import sillyPatch from "./stoel/patch";

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
    	enableMD: true,
    	enableMU: true,
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
    		sillyPatch(),
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
                        
                        const position = Math.max(buttons.findIndex((x) => x?.props?.message === i18n?.Messages?.MESSAGE_ACTION_REPLY), 0)
                        
                        const originalMessage = MessageStore.getMessage(message.channel_id, message?.id)

                        const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        const escapedBuffer = escapeRegex(storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`")

                        const separator = new RegExp(escapedBuffer, 'gmi');
                        const checkIfBufferExist = separator.test(message.content);

                        if(checkIfBufferExist) {
                            const targetPos = position || 1;
                            
                            buttons.splice(targetPos, 0, (
                                <FormRow
                                    label="Remove Edit History"
                                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_edit_24px")} />}
                                    onPress={() => {
                                        let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
                                        Edited = Edited + "\n\n";                                    

                                        const lats = message?.content?.split(Edited);
                                        const targetMessage = lats[lats.length - 1];

                                        // console.log(message.embeds)

                                        const messageEmbeds = message?.embeds?.map(embedData => {                                            
                                            const rawHSLA = embedData?.color?.replace(/.+\(/, "")?.replace(/\%/g, "")?.replace(")", "")

                                            const split = rawHSLA?.split(', ')

                                            const embedColor = ReactNative.processColor(`${
                                                setOpacity(
                                                    colorConverter.HSLtoHEX(
                                                        split[0], split[1], split[2]
                                                    ), 
                                                    split[3]
                                                )
                                            }`)

                                            return {
                                                ...embedData,
                                                author: embedData.author,
                                                title: embedData.rawTitle,
                                                description: embedData.rawDescription,
                                                url: embedData.url,
                                                type: embedData.type,
                                                image: embedData.image,
                                                thumbnail: embedData.thumbnail,
                                                color: embedColor,
                                                content_scan_version: 1
                                            }
                                        })

                                        // console.log(messageEmbeds)

                                        FluxDispatcher.dispatch({
                                            type: "MESSAGE_UPDATE",
                                            message: {
                                                ...message,
                                                content: `${targetMessage}`,
                                                embeds: messageEmbeds ?? [],
                                                attachments: message.attachments ?? [],
                                                mentions: message.mentions ?? [],
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

/*
{
    type: 'MESSAGE_UPDATE',
    guildId: '871446026228215849',
    message: {
        id: message.id,
        type: message
    }

}


{ 
    type: 'MESSAGE_UPDATE',
    guildId: '871446026228215849',
    message: { 
        id: '1180921297971187723',
        type: 0,
        tts: false,
        timestamp: '2023-12-03T17:19:37.893000+00:00',
        pinned: false,
        mentions: [],
        mention_roles: [],
        mention_everyone: false,
        member: { 
            roles: [ '871804391831769129', '926362271951769620' ],
            premium_since: null,
            pending: false,
            nick: 'iririr',
            mute: false,
            joined_at: '2021-09-13T09:47:09.254000+00:00',
            flags: 0,
            deaf: false,
            communication_disabled_until: '2022-04-03T00:13:31.070000+00:00',
            avatar: null 
        },
        flags: 0,
        embeds: [],
        edited_timestamp: '2023-12-03T17:29:37.897193+00:00',
        content: 'cat https://youtu.be/',
        components: [],
        channel_id: '1180891225969131560',
        author: { 
            username: 'alexesix',
            public_flags: 0,
            premium_type: 0,
            id: '791682875224490014',
            global_name: 'AlexEsix',
            discriminator: '0',
            avatar_decoration_data: null,
            avatar: '737f2ea62f64ee27e01402741630cc4e' 
        },
        attachments: [],
        guild_id: '871446026228215849'
    } 
}

{ 
    type: 'MESSAGE_UPDATE',
    guildId: '871446026228215849',
    message: { 
        id: '1180921297971187723',
        embeds: [{ 
            url: 'https://youtu.be/',
            type: 'link',
            title: 'YouTube',
            thumbnail: { 
                width: 1200,
                url: 'https://www.youtube.com/img/desktop/yt_1200.png',
                proxy_url: 'https://images-ext-1.discordapp.net/external/Y9ec_ju_jMFXEYbE-Ie5kPp5R5im0556dCBV7EPvn8M/https/www.youtube.com/img/desktop/yt_1200.png',
                height: 1200 
            },
            description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 
            content_scan_version: 1 
        }],
        channel_id: '1180891225969131560',
        guild_id: '871446026228215849' 
    } 
}

{ 
    id: '1180921297971187723',
    type: 0,
    channel_id: '1180891225969131560',
    author: { 
        hasFlag: [Function: value],
        isStaff: [Function: value],
        isStaffPersonal: [Function: value],
        hasAnyStaffLevel: [Function: value],
        id: '791682875224490014',
        username: 'alexesix',
        discriminator: '0',
        avatar: '737f2ea62f64ee27e01402741630cc4e',
        avatarDecorationData: null,
        email: 'randirachmadperdana@gmail.com',
        verified: true,
        bot: false,
        system: false,
        mfaEnabled: false,
        mobile: true,
        desktop: false,
        premiumType: null,
        flags: 32,
        publicFlags: 0,
        purchasedFlags: 0,
        premiumUsageFlags: 0,
        phone: null,
        nsfwAllowed: true,
        guildMemberAvatars: {},
        hasBouncedEmail: false,
        personalConnectionId: null,
        globalName: 'AlexEsix' 
    },
    content: 'cat https://youtu.be  `[ EDITED ]`\n\ncat https://youtu.be/',
    customRenderedContent: undefined,
    attachments: [],
    embeds: [{ 
        id: 'embed_88',
        url: 'https://youtu.be/',
        type: 'link',
        rawTitle: 'YouTube',
        rawDescription: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
        referenceId: undefined,
        flags: undefined,
        thumbnail: { 
            url: 'https://www.youtube.com/img/desktop/yt_1200.png',
            proxyURL: 'https://images-ext-1.discordapp.net/external/Y9ec_ju_jMFXEYbE-Ie5kPp5R5im0556dCBV7EPvn8M/https/www.youtube.com/img/desktop/yt_1200.png',
            width: 1200,
            height: 1200 
        },
        fields: [] 
    }],
    mentions: [],
    mentionRoles: [],
    mentionChannels: [],
    mentioned: false,
    pinned: false,
    mentionEveryone: false,
    tts: false,
    codedLinks: [],
    giftCodes: [],
    timestamp: {},
    editedTimestamp: 
    state: 
    nonce: 
    blocked: 
    call: 
    bot: 
    webhookId: 
    reactions: 
    applicationId: 
    application: 
    activity: 
    messageReference: 
    flags: 
    isSearchHit: 
    stickers: 
    stickerItems: 
    components: 
    loggingName: 
    colorString: 
    nick: 
    interaction: 
    interactionData: 
    interactionError: 
    roleSubscriptionData: 
    poll: 
    referralTrialOfferId: 
}



*/

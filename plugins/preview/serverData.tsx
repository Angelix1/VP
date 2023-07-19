import { find, findByProps, findByStoreName, findByName } from "@vendetta/metro"
import { semanticColors, rawColors } from "@vendetta/ui";
import { React, ReactNative, constants, clipboard, stylesheet,} from "@vendetta/metro/common"
import { Forms, General } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"

const EmojiStore = findByStoreName('EmojiStore')
const StickersStore = findByStoreName('StickersStore')

// Ext File
import { showOptions } from "./showOptions";

const { openMediaModal } = findByName("MediaModal", false);

const { FormLabel, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;
const { ScrollView, TextInput, TouchableOpacity, View, Image, Text, Animated } = General;


const styles = stylesheet.createThemedStyleSheet({
    container: {
        marginTop: 25,
        marginLeft: '5%',
        marginBottom: -15,
        flexDirection: "row"
    },
    textContainer: {
        paddingLeft: 15,
        paddingTop: 5,
        flexDirection: 'column',
        flexWrap: 'wrap',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.10,
        shadowRadius: 4.65,
        elevation: 8
    },
    shadow: {
        shadowColor: "#444",
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.10,
        shadowRadius: 4.65,
        elevation: 8
    },
    image: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.10,
        shadowRadius: 4.65,
        elevation: 8
    },
    mainText: {
        opacity: 0.975,
        letterSpacing: 0.25
    },
    header: {
        color: semanticColors.HEADER_PRIMARY,
        fontFamily: constants.Fonts.DISPLAY_BOLD,
        fontSize: 24,
        letterSpacing: 0.25
    },
    greenText: {
        color: semanticColors.TEXT_POSITIVE,
        fontFamily: constants.Fonts.DISPLAY_BOLD,
    },
    buffer: {
        padding: 14
    },
    bg: {
        backgroundColor: '#FFF'
    },
    bg2: {
        backgroundColor: '#DAF0FA'
    },
});

export default function ServerData({ guild }) {

    let [eoj, setEoj] = React.useState(false)
    let [stc, setStc] = React.useState(false)

    const emojis = EmojiStore.getGuildEmoji(guild?.id)
    const stickers = StickersStore.getStickersByGuildId(guild?.id)

    let mappedEmojis = [];
    let mappedStickers = [];

    if(emojis?.length > 0) {
        for(let emoji of emojis) {
        // console.log(emoji)                                        
            let url = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}?size=4096`;
            mappedEmojis.push({ name: emoji?.name, url: url, type: 'emoji' });
        }
    }

    // console.log(mappedEmojis[0])

    if(stickers?.length > 0) {
        for(let sticker of stickers) {
            if(sticker?.format_type != 3) {
                let url = `https://media.discordapp.net/stickers/${sticker.id}.${sticker.format_type == 1 ? "png" : sticker.format_type == 2 ? "png" : "gif"}?size=4096`;
                mappedStickers.push({ name: sticker.name, url, type: 'sticker' })
            }
        }
    }

    let cdn = 'https://cdn.discordapp.com'
    let serverIcon = `${cdn}/icons/${guild?.id}/${guild?.icon}${guild?.icon?.startsWith?.('a_') ? '.gif' : '.png'}?size=4096`;
    let banner;
    let splash;
    let dSplash;

    if(guild?.banner) banner = `${cdn}/banners/${guild?.id}/${guild?.banner}${guild?.icon?.startsWith?.('a_') ? '.gif' : '.png'}?size=4096`;
    if(guild?.splash) splash = `${cdn}/splashes/${guild?.id}/${guild?.splash}.png?size=4096`;
    if(guild?.discoverySplash) dSplash = `${cdn}/discovery-splashes/${guild?.id}/${guild?.discoverySplash}.png?size=4096`;

    function openImageUrl(url) {
        ReactNative.Image.getSize(url, (width, height) => {
            openMediaModal({
                initialSources: [{
                    uri: url,
                    sourceURI: url,
                    width,
                    height,
                    guildId: '1', 
                    channelId: '1' 
                }],
                initialIndex: 0,
                originLayout: { 
                    width, 
                    height, 
                    x: 1, 
                    y: 1, 
                    resizeMode: "auto" 
                },
            });
        });
    }

    // console.log(guild)

    const animatedButtonScale = React.useRef(new Animated.Value(1)).current;
    const animatedScaleStyle = {
        transform: [{ scale: animatedButtonScale }]
    };

    function ImageRender(url, size = 256) {
        return (<>
            <Animated.View style={animatedScaleStyle}>
                <Image
                    style={[styles.image, { height: size, width: size+192 }]}
                    source={{ uri: url }}
                />
            </Animated.View>
        </>)
    }

    let TextShit = [styles.header, styles.greenText, styles.buffer]

    return (<>
        <ScrollView>
            <View style={{ marginBottom: 60 }}>
                <View style={[{marginBottom: 20}]}>
                    <FormSection style={[styles.shadow]}>
                        <View style={{ paddingLeft: 16 }}>
                            <FormRow 
                                label="Server Name" style={ [...TextShit] }
                                subLabel={guild.name || "naem"}
                            />
                            <FormDivider />

                            <FormRow 
                                label="Server Description" style={ [...TextShit] }
                                subLabel={guild.description || "No Description"}
                            />
                            <FormDivider />

                            <FormRow 
                                label="Member Count" style={ [...TextShit] }
                                subLabel={guild.memberCount || "No Data"}
                            />
                            <FormDivider />

                            <FormRow 
                                label="Presence Count" style={ [...TextShit] }
                                subLabel={guild.presenceCount || "No Data"}
                            />
                            <FormDivider />

                            <FormRow label="Server Icon" style={[...TextShit]}/>
                                <View style={[styles.buffer, {paddingBottom: 16}]}>
                                    <TouchableOpacity onPress={() => openImageUrl(serverIcon)}>{ 
                                        ImageRender(serverIcon) 
                                    }</TouchableOpacity>
                                </View>
                            <FormDivider />

                            {
                                banner && <>
                                    <FormRow label="Server Banner" style={[...TextShit]}/>
                                        <View style={[styles.buffer, {paddingBottom: 16}]}>
                                            <TouchableOpacity onPress={() => openImageUrl(banner)}>{ 
                                                ImageRender(banner) 
                                            }</TouchableOpacity>
                                        </View>
                                    <FormDivider />
                                </>
                            }
                            {
                                splash && <>
                                    <FormRow label="Server Splash" style={[...TextShit]}/>
                                        <View style={[styles.buffer, {paddingBottom: 16}]}>
                                            <TouchableOpacity onPress={() => openImageUrl(splash)}>{ 
                                                ImageRender(splash) 
                                            }</TouchableOpacity>
                                        </View>
                                    <FormDivider />
                                </>
                            }
                            {
                                dSplash && <>
                                    <FormRow label="Server Discovery" style={[...TextShit]}/>
                                        <View style={[styles.buffer, {paddingBottom: 16}]}>
                                            <TouchableOpacity onPress={() => openImageUrl(dSplash)}>{ 
                                                ImageRender(dSplash) 
                                            }</TouchableOpacity>
                                        </View>
                                    <FormDivider />
                                </>
                            }  
                            {
                                (mappedEmojis?.length > 0) && <FormRow 
                                    label='Emoji'
                                    subLabel='Show emojis of this guild'
                                    trailing={
                                      <FormSwitch
                                        value={eoj}
                                        onValueChange={ (value) => setEoj(value) }
                                      />
                                    }
                                    style={[styles.mainText, styles.buffer, styles.header]}
                                />
                            }
                            {
                                eoj && mappedEmojis.map((emoj, index) => {
                                    return (<>
                                        <View style={[
                                            styles.container, { 
                                                padding:12, 
                                                flexDirection: 'row',
                                                textAlign: 'center'
                                            }

                                        ]}>
                                            <TouchableOpacity 
                                                onPress={() => showOptions(emoj, guild)}
                                            >
                                                <Animated.View style={animatedScaleStyle}>
                                                    <Image
                                                        style={[styles.image, { height: 128, width: 128 }]}
                                                        source={{ uri: emoj.url }}
                                                    />
                                                </Animated.View>
                                            </TouchableOpacity>
                                            <View style={styles.textContainer}>
                                                <Text style={[styles.mainText, styles.header]}>{ emoj.name || 'No Name' }</Text>
                                            </View>
                                            {index !== mappedEmojis?.length - 1 && <FormDivider />}
                                        </View>
                                    </>)
                                })
                            }

                            {
                                (mappedStickers?.length > 0) && <FormRow 
                                    label='Stickers'
                                    subLabel='Show stickers of this guild'
                                    trailing={
                                      <FormSwitch
                                        value={stc}
                                        onValueChange={ (value) => setStc(value) }
                                      />
                                    }
                                    style={[styles.mainText, styles.buffer, styles.header]}
                                />
                            }
                            {
                                stc && mappedStickers.map((emoj, index) => {
                                    return (<>
                                        <View style={[
                                            styles.container, { 
                                                padding:12, 
                                                flexDirection: 'row',
                                                textAlign: 'center'
                                            }

                                        ]}>
                                            <TouchableOpacity 
                                                onPress={() => showOptions(emoj, guild)}
                                            >
                                                <Animated.View style={animatedScaleStyle}>
                                                    <Image
                                                        style={[styles.image, { height: 256, width: 256 }]}
                                                        source={{ uri: emoj.url }}
                                                    />
                                                </Animated.View>
                                            </TouchableOpacity>
                                            <View style={styles.textContainer}>
                                                <Text style={[styles.mainText, styles.header]}>{ emoj.name || 'No Name' }</Text>
                                            </View>
                                            {index !== mappedEmojis?.length - 1 && <FormDivider />}
                                        </View>
                                    </>)
                                })
                            }
                        </View>
                    </FormSection>
                </View>
            </View>
        </ScrollView>
    </>)
}


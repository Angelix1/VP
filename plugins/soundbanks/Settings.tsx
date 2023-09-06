import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { NavigationNative, React, ReactNative, constants, stylesheet, clipboard } from "@vendetta/metro/common";
import { findByName, findByProps } from "@vendetta/metro";
import { semanticColors, rawColors } from "@vendetta/ui";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

// find stuff
const useIsFocused = findByName("useIsFocused");
const LinearGradient = findByName("LinearGradient");

// Icons idk
const Add = getAssetIDByName("ic_add_24px");
const Checkmark = getAssetIDByName("ic_unread_checkmark");
const Crossmark = getAssetIDByName("Small");

// Import Page
import Edit from './Edit';

const Styles = stylesheet.createThemedStyleSheet({
    border: {
        borderRadius: 12,
        overflow: 'hidden'
    },
    shadowTemplate: {
        shadowOffset: {
            width: 1,
            height: 3,
        },
        shadowOpacity: 0.9,
        shadowRadius: 24.00,
        elevation: 16,
    },
    input: {
      fontSize: 16,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM,
      color: semanticColors.TEXT_NORMAL
    },
    placeholder: {
      color: semanticColors.INPUT_PLACEHOLDER_TEXT
    }
})


export default function Settings() {
    useProxy(storage)

    storage.soundDatas ??= [];

    const navigation = NavigationNative.useNavigation();
    useIsFocused();

    const [newID, setNewID] = React.useState("")
    const [animation, setAnimation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(
                animation,
                {
                    toValue: 4,
                    duration: 8000,
                    useNativeDriver: true,
                }
            )
        ).start();
    }, []);

    const bgStyle = {
        backgroundColor: animation.interpolate({
            inputRange: [0, 1, 2, 3, 4],
            outputRange: [
                "rgba(188,31,31,0.5)",
                "rgba(46,168,30,0.5)",
                "rgba(48,179,173,0.5)",
                "rgba(183,40,198,0.5)",
                "rgba(188,31,31,0.5)",
            ],
        }),
    };

    /*
        {
            sound_id: Number,
            sound_name: String,
            sound_url: String,
            sound_match: String,
            sound_regex: Regex <String>,
            regex_flag: Regex <String>,
            repeat_sound: Boolean,
            use_regex: Boolean
        }
    */

    const Links = [
        {
            label: 'Vine Boom SFX',
            callback: () => {
                storage.soundDatas.push({
                    sound_id: bufferForIDs + storage.soundDatas.length,
                    sound_name: 'Vine Boom SFX',
                    sound_url: 'https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/sound/chatsounds/autoadd/memes/overused%20thud.ogg',
                    sound_match: 'moyai',
                    sound_regex: "((<a?\:)?.*?moy?ai.*?(\:>)?|🗿)",
                    regex_flag: "gi",
                    repeat_sound: false,
                    use_regex: false
                })
                showToast('Vine Boom Added', Checkmark)
            }
        },
        {
            label: 'Discordo',
            callback: () => {
                storage.soundDatas.push({
                    sound_id: bufferForIDs + storage.soundDatas.length,
                    sound_name: 'Discordo SFX',
                    sound_url: 'https://discord.com/assets/ae7d16bb2eea76b9b9977db0fad66658.mp3',
                    sound_match: 'discordo',
                    sound_regex: "(dc|discord(o)?)",
                    regex_flag: "gi",
                    repeat_sound: false,
                    use_regex: false
                })
                showToast('Discordo Added', Checkmark)
            }
        }
    ]

    const bufferForIDs = 10_000;

    const addSound = () => {
        if( storage.soundDatas.some(o => o.sound_id == newID) )
            return showToast('[SOUNDBANKS] Sound ID must be unique.', Crossmark)

        if(newID) {
            const NID = Number(newID);
            if(isNaN(NID)) return showToast('[SOUNDBANKS] Sound ID must be Number.', Crossmark);

            // Additional Check cuz im paranoid
            if(NID < 0) return showToast('[SOUNDBANKS] Sound ID cannot be negative', Crossmark);

            NID = Math.round(Math.abs(NID));

            NID = NID + bufferForIDs;

            storage.soundDatas.push({
                sound_id: NID,
                sound_name: "",
                sound_url: "",
                sound_match: "",
                sound_regex: "",
                regex_flag: "gi",
                repeat_sound: false,
                use_regex: false
            })
            
            setNewID("")

            navigation.push("VendettaCustomPage", {
                title: `Adding Sound`,
                render: () => <Edit index={storage.soundDatas?.length - 1} />
            })
        }
    };

    return (<>
        <ScrollView>
            <LinearGradient 
                start={{x: 0.8, y: 0}}
                end={{x: 0, y: 0.8}}
                colors={['#b8ff34', '#4bff61', '#44f6ff', "#4dafff", '#413dff', '#d63efd']}
                style={[
                    Styles.border,
                    Styles.shadowTemplate,
                    { 
                        flex: 1,
                        margin: "1%",
                        shadowColor: "#b8ff34"
                    }
                ]}
            >
                <View style={[
                    Styles.border,
                    bgStyle,
                    {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        margin: 2,
                        padding: "3%"
                    }
                ]}>
                    <FormSection title="Quick Urls">
                        <Animated.View style={[Styles.border, bgStyle]}>
                            <View style={[]}>{
                                Links.map((codex) => {                            
                                    return <>
                                        <FormRow 
                                            label={codex?.label}
                                            trailing={<FormArrow />}
                                            onPress={codex?.callback}
                                        />
                                    </>
                                })
                            }
                            </View>                    
                        </Animated.View>
                    </FormSection>

                    <FormSection title="Sound List" style={[]}>
                        <View style={[]}>
                            {
                                (storage.soundDatas.length > 0) && storage.soundDatas?.map((comp, i) => {

                                    return (<>
                                        <FormRow
                                            label={
                                                (
                                                    (comp?.sound_name.length > 0) ? 
                                                        (`${comp?.sound_name} [ ${bufferForIDs - comp?.sound_id} ]`) : 
                                                            (bufferForIDs - comp?.sound_id)
                                                ) || "Unknown"
                                            }
                                            trailing={<FormArrow />}
                                            onPress={() => navigation.push("VendettaCustomPage", {
                                                title: "Editing Sound",
                                                render: () => <Edit index={i} />
                                            })}
                                        />
                                        {i !== storage.soundDatas?.length - 1 && <FormDivider />}
                                    </>);
                                })
                            }
                            <FormRow
                                label={
                                    <TextInput
                                        value={newID}
                                        onChangeText={setNewID}
                                        placeholder="Sound ID"
                                        placeholderTextColor={Styles.placeholder.color}
                                        selectionColor={constants.Colors.PRIMARY_DARK_100}
                                        onSubmitEditing={addSound}
                                        returnKeyType="done"
                                        style={[Styles.input]}
                                    />
                                }
                                trailing={
                                    <TouchableOpacity 
                                        onPress={addSound}>
                                        <FormIcon style={{ opacity: 1 }} source={Add}/>
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                    </FormSection>
                </View>
            </LinearGradient>
        </ScrollView>
    </>);
}


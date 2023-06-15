import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { NavigationNative, constants, stylesheet, clipboard } from "@vendetta/metro/common";
import { findByName, findByProps } from "@vendetta/metro";
import { semanticColors, rawColors } from "@vendetta/ui";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, TouchableOpacity, TextInput } = General;
const { FormLabel, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

// find stuff
const Icon = findByName("Icon");
const useIsFocused = findByName("useIsFocused");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");

// Icons idk
const Add = getAssetIDByName("ic_add_24px");
const Mod = getAssetIDByName("ic_arrow");
const Remove = getAssetIDByName("ic_minus_circle_24px");
const Checkmark = getAssetIDByName("Check");
const Crossmark = getAssetIDByName("Small");


// Import Page
import Edit from './Edit';

const styles = stylesheet.createThemedStyleSheet({
    basicPad: {
        paddingRight: 10,
        marginBottom: 10,
        letterSpacing: 0.25,        
    },
    header: {
        color: semanticColors.HEADER_SECONDARY,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        paddingLeft: "3%",
        fontSize: 24
    },
    sub: {
        color: semanticColors.TEXT_POSITIVE,
        fontFamily: constants.Fonts.DISPLAY_NORMAL,
        paddingLeft: "4%",
        fontSize: 18  
    },
    flagsText: {
        color: semanticColors.HEADER_SECONDARY,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        paddingLeft: "4%",
        fontSize: 16
    },
    input: {
        fontSize: 16,
        fontFamily: constants.Fonts.PRIMARY_MEDIUM,
        color: semanticColors.TEXT_NORMAL
    },
    placeholder: {
        color: semanticColors.INPUT_PLACEHOLDER_TEXT
    }    
});


// storage.soundDatas


const placeholder = 'MissingNo';
const HEX_regex = /[0-9A-Fa-f]{6}/;

let switches = [];

let Notes = [
    `Current Audio Extension that's Supported is mp3, ogg, wav.`,
    `Sound ID must be unique and not Clashing to other Sound.`,
    `Type of Sound ID is Number strictly.`,
    `Sound URL must start with http(s) and ends with extension and must be a static url.`
]


export default function Settings() {
    useProxy(storage)

    let [newID, setNewID] = React.useState("")

    const navigation = NavigationNative.useNavigation();
    useIsFocused();

    // storage.soundDatas ??= [];
    /*
        {
            id: Number,
            match: String,
            url: String,
            regex: String,
            usingRegex: Boolean,
        }
    */

    let sounds = storage.soundDatas;

    let STATIC_AUDIO_REGEX = /((http(s)?\:\/\/)(((?!\?).)+\.(mp3|ogg|wav)))/i;

    const addSound = () => {
        if( storage.soundDatas.some(o => o.id == newID) )
            return showToast('Sound ID must be unique.', Crossmark)

        if(newID) {

            sounds.push({ id: newID, url: '', match: '', regex: false, flags: "gi" })
            
            setNewID("")

            navigation.push("VendettaCustomPage", {
                title: `Adding Sound`,
                render: () => <Edit index={storage?.soundDatas?.length - 1} />
            })
        }
    };

    return (<>
        <ScrollView style={{ flex: 1 }} >

            <FormSection title="Guidelines" style={[styles.header, styles.basicPad]}>
                <View style={[styles.header, styles.sub]}>{
                    Notes.map((c, i) => {
                        return <FormRow label={<FormLabel text={c}/> } />
                    })
                }
                </View>

                <FormRow 
                    label="copu"
                    trailing={<FormArrow />}
                    onPress={() => {
                        clipboard
                        .setString("https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/sound/chatsounds/autoadd/memes/overused%20thud.ogg")
                        showToast("aaa")
                    }}
                />

            </FormSection>

            <FormSection title="Audio List" style={[styles.header, styles.basicPad]}>
                <View style={[styles.header, styles.sub]}>
                    {
                        storage.soundDatas?.map((comp, i) => {
                            return (<>
                                <FormRow
                                    label={comp.id}
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
                                placeholder="New Sound ID"
                                placeholderTextColor={styles.placeholder.color}
                                selectionColor={constants.Colors.PRIMARY_DARK_100}
                                onSubmitEditing={addSound}
                                returnKeyType="done"
                                style={styles.input}
                            />
                        }
                        trailing={
                            <TouchableOpacity 
                                onPress={addSound}>
                                <Icon source={Add} />
                            </TouchableOpacity>
                        }
                    />
                </View>
            </FormSection>
            
        </ScrollView>
    </>);
}


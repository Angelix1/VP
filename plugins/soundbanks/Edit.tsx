import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { findByName } from "@vendetta/metro";
import { Forms, General } from "@vendetta/ui/components";
import { NavigationNative, constants, stylesheet } from "@vendetta/metro/common";
import { semanticColors, rawColors } from "@vendetta/ui";

const { ScrollView, View, Text } = General;
const { FormLabel, FormRow, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

const useIsFocused = findByName("useIsFocused");

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
    }   
});


export default function Edit({ index }) {
    
    const object = storage.soundDatas[index];
    useProxy(storage);

    const navigation = NavigationNative.useNavigation();
    const bufferForIDs = 10_000;

    // console.log(storage.soundDatas)

    return (
        <ScrollView>
            <FormSection style={[styles.basicPad]}>
                <View style={[styles.basicPad, styles.sub]}>

                    <FormSection title="Sound ID" style={[styles.header]}>                        

                        <Text style={[styles.basicPad, styles.flagsText]}>{
                            `${object.sound_id - bufferForIDs ?? "UNKNOWN"}`
                        }</Text>

                        <FormInput
                            title="Assign a Name"
                            placeholder="Meow!"
                            value={object?.sound_name}
                            onChange={(v) => object.sound_name = v}
                        />
                        <FormInput
                            title="Sound URL"
                            placeholder="https://example.com/audio/im_cool.ogg"
                            value={object?.sound_url}
                            onChange={(v) => object.sound_url = v}
                        />
                        {!storage.soundDatas[index].use_regex && <>
                            <FormInput
                                title="Normal Match (if included once in a message)"
                                placeholder="cat"
                                value={object?.sound_match}
                                onChange={(v) => object.sound_match = v}
                            />
                        </>}
                        {storage.soundDatas[index].use_regex && <>
                            <FormDivider />
                            <FormInput
                                title="Regex Syntax"
                                placeholder="c(a)+t"
                                value={object?.sound_regex}
                                onChange={(v) => object.sound_regex = v}
                            />
                        </>}
                        {storage.soundDatas[index].use_regex && <>
                            <FormDivider />
                            <FormInput
                                title="Flags"
                                placeholder="gi"
                                value={object?.regex_flag}
                                onChange={(v) => object.regex_flag = v}
                            />
                        </>}
                        {storage.soundDatas[index].use_regex && <>
                            <FormDivider />
                            <FormSwitchRow
                                label="Repeat sound for every match"
                                value={storage.soundDatas[index].repeat_sound}
                                onValueChange={(v) => storage.soundDatas[index].repeat_sound = v}
                            />
                        </>}
                    </FormSection>

                    <FormSection>
                        <FormSwitchRow
                            label="Regular expression"
                            subLabel="Turn on to use regular expression"
                            value={storage.soundDatas[index].use_regex}
                            onValueChange={(v) => storage.soundDatas[index].use_regex = v}
                        />
                    </FormSection>
                </View>
            </FormSection>

            <FormRow 
                label={<FormLabel text="Delete" style={{ color: rawColors.RED_400 }}/> } 
                onPress={() => {
                    navigation.pop()
                    setTimeout(() => storage.soundDatas.splice(index, 1), 300)
                }
            }/>
        </ScrollView>
    )    
}
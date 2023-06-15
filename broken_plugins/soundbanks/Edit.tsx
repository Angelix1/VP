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
	
    let object = storage.soundDatas[index];
	useProxy(storage);

	const navigation = NavigationNative.useNavigation();

    console.log(storage.soundDatas)

    return (
        <ScrollView>
            <FormSection style={[styles.basicPad]}>
                <View style={[styles.basicPad, styles.sub]}>

                    <FormSection title="Sound ID" style={[styles.header]}>
                        <Text style={[styles.basicPad, styles.flagsText]}>{
                            `${object.id}`
                        }</Text>
                    </FormSection>
                    
                    <FormSection>
                        <FormInput
                            title="Sound URL"
                            placeholder="https://example.com/audio/im_cool.ogg"
                            value={object?.url}
                            onChange={(v: string) => object.url = v}
                        />
                        <FormInput
                            title="Match"
                            placeholder="cool"
                            value={object?.match}
                            onChange={(v: string) => object.match = v}
                        />
                        {storage.soundDatas[index].regex && <>
                            <FormDivider />
                            <FormInput
                                title="Flags"
                                placeholder="gi"
                                value={object?.flags}
                                onChange={(v: string) => object.flags = v}
                            />
                        </>}
                    </FormSection>

                    <FormSection>
                        <FormSwitchRow
                            label="Regular expression"
                            subLabel="Turn on if your checks is a regular expression"
                            value={storage.soundDatas[index].regex}
                            onValueChange={(v: boolean) => storage.soundDatas[index].regex = v}
                        />
                    </FormSection>
                </View>
            </FormSection>

            <FormRow 
                label={<FormLabel text="Delete Sound" style={{ color: rawColors.RED_400 }}/> } 
                onPress={() => {
                    storage.soundDatas.splice(index, 1);
                    navigation.pop()
                }
            }/>
        </ScrollView>
    )    
};
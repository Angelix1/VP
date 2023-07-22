import { NavigationNative, clipboard, constants, React, stylesheet, ReactNative as RN } from "@vendetta/metro/common";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, TouchableOpacity, TextInput } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

import { semanticColors } from "@vendetta/ui";

const styles = stylesheet.createThemedStyleSheet({
  text: {
    color: semanticColors.HEADER_SECONDARY,
    paddingLeft: "5.5%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: constants.Fonts.PRIMARY_BOLD,
    fontSize: 16
  },
  subText: {
    color: semanticColors.TEXT_POSITIVE,
    paddingLeft: "6%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: constants.Fonts.DISPLAY_NORMAL,
    fontSize: 12    
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


// icons
const Add = getAssetIDByName("ic_add_24px");

// props
const { getUser } = findByProps('getUser');
const useIsFocused = findByName("useIsFocused");

const switches = [
  {
    id: "copy_no_share",
    default: false,
    label: "Copy No Share",
    subLabel: "Replace Share button on Image Modal Preview",
  },
  {
    id: "lpm_qol",
    default: false,
    label: "Long Press Message QOL",
    subLabel: "Add 3 button when long press a message (copy [UUID, Mention, Both])",
  },  
]


/* Vars 
bool.
"copy_no_share"
"lpm_qol"

setting vars
settings.
'patch'

*/

export default () => {  
  useProxy(storage);

  return (
    <ScrollView>
      <View style={{marginTop: 20, marginBottom: 20}}>

        <FormSection title="Plugin Setting" style={[styles.header]}>
        <FormRow 
          label="Reload the Plugin to Apply the Patches"
        />
        <FormDivider />
          <FormRow 
            label='Patches'
            subLabel='Show Patches for the plugin'
            leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_category_16px")} />}
            trailing={
              <FormSwitch
                value={storage['patch'] ?? false}
                onValueChange={ (value) => (storage['patch'] = value) }
              />
            }
          />
          { storage['patch'] && (
              <View style={[styles.subText]}>{
                switches.map((p, i) => {
                  return (<>
                    <FormRow 
                      label={p.label}
                      subLabel={p.subLabel}
                      leading={p.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(p.icon)} />}
                      trailing={
                        ("id" in p) ? (
                          <FormSwitch
                            value={storage.bool[p.id] ?? p.default}
                            onValueChange={ (value) => (storage.bool[p.id] = value) }
                          />
                        ) : undefined
                      }
                    />
                    {i !== switches.length - 1 && <FormDivider />}
                  </>)
                })
              }
              </View>
          )} 
        </FormSection>
      </View>
    </ScrollView>
  )
}

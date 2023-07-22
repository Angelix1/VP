import update from './update';
import ListUsers from './listUsers';

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


let upper = (s) => { return s.toUpperCase() };

let pvars = [
  {
    id: "deletedMessageColor",
    title: "Customize Deleted Message Color ( DO NOT INCLUDE # )",
    type: "default",
    placeholder: "E40303",
  },
  {
    id: "deletedMessage",
    title: "Customize Deleted Message",
    type: "default",
    placeholder: "This message is deleted",
  },
  {
    id: "editedMessage",
    title: "Customize Edited Separator",
    type: "default",
    placeholder: "`[ EDITED ]`",
  },
  {
    id: "deletedMessageColorBackground",
    title: "Customize Deleted Background Message Color ( DO NOT INCLUDE # )",
    type: "default",
    placeholder: "FF2C2F",
  },
]

const switches = [
  {
    id: "minimal",
    default: true,
    label: "Minimalistic Settings",
    subLabel: "Removes all Styling (Enabled by Default)",
  },
  {
    id: "useBackgroundColor",
    default: false,
    label: "Enable Background Color",
    subLabel: "Background Color for Deleted Message, similiar to Mention but Customizeable",
  },
  {
    id: "ignoreBots",
    default: false,
    label: "Ignore Bots",
    subLabel: "Ignore bot deleted messages.",
  },  
]


/* settings IDs and Vars
"deletedMessage"
"editedMessage"
"deletedMessageColorBackground"
"useBackgroundColor"

storage['customize'] = customization
storage['ignore'] = Ignore List
storage['showChanges'] = Patches
storage.ignoreBots = false

storage.users = []
*/

export default () => {  
  useProxy(storage);
  
  const navigation = NavigationNative.useNavigation();
  useIsFocused();

  let users = storage.users ?? [];

  const listIgnore = () => {
    navigation.push("VendettaCustomPage", {
      title: `List of Ignored Users`,
      render: () => <ListUsers/>
    })
  }

  return (
    <ScrollView>
      <View style={{marginTop: 20, marginBottom: 20}}>

        <FormSection title="Plugin Setting" style={[styles.header]}>
          <FormRow 
            label='Customization'
            subLabel='Show customization for the plugin'
            leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_category_16px")} />}
            trailing={
              <FormSwitch
                value={storage['customize'] ?? false}
                onValueChange={ (value) => (storage['customize'] = value) }
              />
            }
          />

          { storage['customize'] && (
            <FormRow 
              label="Reload the Plugin to Apply Color Change"
            />
          ) }
          
          { storage['customize'] && (
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
                            value={storage[p.id] ?? p.default}
                            onValueChange={ (value) => (storage[p.id] = value) }
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


          { storage['customize'] && (
              <View style={[styles.subText]}>{
                pvars.map((p, i) => {
                  return(<>
                    <FormInput
                      title={p.title}
                      keyboardType={p.type}
                      placeholder={p.placeholder}
                      value={storage[p.id] ?? p.placeholder}
                      onChange={(val) => (storage[p.id] = val.toString())}
                    />
                    {i !== pvars.length - 1 && <FormDivider />}
                  </>)
                })
              }
              </View>
          )}

        </FormSection>

        <FormSection title="Ignore List Setting" style={[styles.header]}>
          <View style={{
              color: semanticColors.TEXT_POSITIVE,
              paddingLeft: "8%",
              paddingRight: 10,
              marginBottom: 10,
              letterSpacing: 0.25,
              fontFamily: constants.Fonts.DISPLAY_NORMAL,
              fontSize: 12    
            }}>
            <FormRow
              label="Add User to List"
              onPress={listIgnore}
              trailing={
                <TouchableOpacity onPress={listIgnore}>
                  <FormIcon style={{ opacity: 1 }} source={Add} />
                </TouchableOpacity>
            }
            />
            </View>
        </FormSection>

        <FormSection title="Plugin Updates" style={[styles.header]}>
          <FormRow 
            label='Show Changes'
            subLabel='Show New stuff, Fixes, etc for the plugin'
            leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_info")} />}
            trailing={
              <FormSwitch
                value={storage['showChanges'] ?? false}
                onValueChange={ (value) => (storage['showChanges'] = value) }
              />
            }
          />
          {
            storage['showChanges'] && update?.map((elem, ind) => {
              return(<>
                <Text style={[styles.text]}>{elem.version || "Dev Version"}</Text>
                {
                  elem.patch?.map(pat => {
                    return(<>
                      <Text style={[styles.subText]}>{`- ${pat}`}</Text>
                    </>)
                  })
                }
              </>)
            })
          }
        </FormSection>

      </View>
    </ScrollView>
  )
}

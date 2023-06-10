import { constants, React, stylesheet, ReactNative as RN } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";

const { FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;
const { ScrollView, View, Text } = General;

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
  }
});

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
]

let log = [
  {
    version: 'v0.0.8',
    patch: [
      'Added Customizeable Text Color for Deleted Messages.',
      'Changed Deleted Message Patch to use Discord Built-in.',
      'Removed Option to use DELETED, NormalEphemeral, DefaultAutomodEphemeral',
      'Removed Ephemeral Custom Settings.',
      'Removed Ephemeral Patch.',
    ]
  } 
]

export default () => {  
  useProxy(storage);
  return (
    <ScrollView>
      <View style={{marginTop: 20}}>
        <View style={{marginTop: 10}}>
          <Text style={[styles.text, styles.optionText]}>{upper("Customize Separator")}</Text>
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
          <Text style={[styles.subText, styles.optionText]}>{upper("Reload the Plugin to Apply Color Change")}</Text>
          <Text style={[styles.text, styles.optionText]}>{"Changes"}</Text>
          {
            log.map((elem, ind) => {
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
        </View>
      </View>
    </ScrollView>
  )
}

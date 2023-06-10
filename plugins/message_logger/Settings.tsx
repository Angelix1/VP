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
    paddingLeft: "4.5%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: constants.Fonts.PRIMARY_BOLD,
    fontSize: 16
  },
  subText: {
    color: semanticColors.TEXT_POSITIVE,
    paddingLeft: "5%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: constants.Fonts.DISPLAY_NORMAL,
    fontSize: 12    
  }
});

const switches = [
  {
    id: "msg_useDeleted",
    default: false,
    label: "use DELETED",
    subLabel: "use [ DELETED ] instead of using ephemeral message. Will override Normal Ephemeral",
    icon: "ic_edit_24px",
  },
  {
    id: "msg_normalEphemeral",
    default: false,
    label: "use Normal Ephemeral",
    subLabel: "use normal ephemeral message instead of red warning ephemeral message.",
    icon: "img_feed_error_dark",
  },
  { 
    id: "useTimestamps",
    default: false,
    label: "Enable Timestamp",
    subLabel: "This option is for red warning ephemeral message. Show the time of deletion (if using normal ephemeral or [DELETED], this option will be ignored)",
    icon: "ic_clock_timeout_16px"
  },
  { 
    id: "useAMPM",
    default: false, 
    label: "Use AM/PM",
    subLabel: "This option is for red warning ephemeral message.",
    icon: "ic_globe_24px"
  },
]

let pvars = [
  {
    id: "del_var",
    title: "Customize Deleted",
    type: "default",
    placeholder: "`[ DELETED ]`",
  },
  {
    id: "edit_var",
    title: "Customize Edited Separator",
    type: "default",
    placeholder: "`[ EDITED ]`",
  },
]

export default () => {  
  useProxy(storage);
  return (
    <ScrollView>
      <View style={{marginTop: 20}}>
        <View style={{marginTop: 10}}>
          <Text style={[styles.text, styles.optionText]}>{"Customize Separator".toUpperCase()}</Text>
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
                {i !== switches.length - 1 && <FormDivider />}
              </>)
            })
          }
          </View>
          <Text style={[styles.text, styles.optionText]}>{"Preferences".toUpperCase()}</Text>
          <View style={[styles.subText]}>{
            switches.map((p, i) => {
              return (<>
                <FormRow 
                  label={p.label}
                  subLabel={p.subLabel}
                  leading={p.icon && <FormRow.Icon source={getAssetIDByName(p.icon)} />}
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
        </View>
      </View>
    </ScrollView>
  )
}

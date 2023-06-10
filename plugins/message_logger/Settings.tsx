import { constants, React, stylesheet, ReactNative as RN } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";

const { FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider } = Forms;
const { ScrollView, View, Text } = General;

// import {  } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui";

const styles = stylesheet.createThemedStyleSheet({
    text: {
        color: semanticColors.HEADER_SECONDARY,
        paddingLeft: "5.5%",
        paddingRight: 10,
        marginBottom: 10,
        letterSpacing: 0.25,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        fontSize: 12
    },
});

const switches = [
  {
    label: "use DELETE",
    subLabel: "use [ DELETE ] instead of using ephemeral message",
    icon: "ic_edit_24px",
  },
]

export default () => {
  const [, forceUpdate] = React.useReducer((n) => ~n, 0);
   const [useDelete, set_useDelete] = React.useState(storage.useDelete);
  
  useProxy(storage);
  return (
    <ScrollView>
      <View style={{marginTop: 20}}>
        <View style={{marginTop: 10}}>
          <Text style={[styles.text, styles.optionText]}>{"Preferences".toUpperCase()}</Text>
          <View>
            {switches.map((p, i) => (
              <>
                <FormRow 
                  label={p.label}
                  subLabel={p.subLabel}
                  leading={p.icon && <FormRow.Icon source={getAssetIDByName(p.icon)} />}
                  trailing={<FormSwitch
                     value={useDelete}
                     onValueChange={() => {
                        storage.useDelete = !storage.useDelete;
                        set_useDelete(storage.useDelete);
                     }}
                  />}
                />
                {i !== switches.length - 1 && <FormDivider />}
              </>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

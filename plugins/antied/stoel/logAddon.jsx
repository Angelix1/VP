import { NavigationNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { ErrorBoundary, Forms } from "@vendetta/ui/components";

import log from "../pages/log";

const { FormRow } = Forms;

export default () => {
  const navigation = NavigationNative.useNavigation();

  // not sure if ErrorBoundary is even required but i'll keep it here just in case
  return (
    <ErrorBoundary>
      <FormRow
        label="Anti Edit & Delete Logs"
        leading={<FormRow.Icon source={getAssetIDByName("ic_audit_log_24px")} />}
        trailing={FormRow.Arrow}
        onPress={() =>
          navigation.push("VendettaCustomPage", {
            title: "Anti Edit & Delete Logs",
            render: log,
          })
        }
      />
    </ErrorBoundary>
  );
};
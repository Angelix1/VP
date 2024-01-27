import { plugin } from "@vendetta";
import { getAssetIDByName } from "@vendetta/ui/assets";

import { patchSettingsPin } from "./pinToSetting";
import { vstorage } from "..";
import Settings from "../Settings";
import SettingsSection from "./settingAddon";

export default (): (() => void) => {
  const patches = [];
  patches.push(
    patchSettingsPin(
      () => true,
      () => <SettingsSection />,
      {
        key: plugin.manifest.name,
        icon: getAssetIDByName("ic_edit_24px"),
        title: "Anti Edit & Delete",
        page: {
          title: "Antied",
          render: Settings,
        },
      },
    ),
  );

  return () => patches.forEach((x) => x());
};
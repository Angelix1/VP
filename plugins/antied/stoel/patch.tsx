import { plugin } from "@vendetta";
import { getAssetIDByName } from "@vendetta/ui/assets";

import { patchSettingsPin } from "./pinToSetting";

import Settings from "../Settings";
import SettingsSection from "./settingAddon";

import Log from "../pages/log";
import LogSection from "./logAddon";

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
					title: "Anti Edit & Delete",
					render: Settings,
				},
			},
		),
		patchSettingsPin(
			() => true,
			() => <LogSection />,
			{
				key: plugin.manifest.name,
				icon: getAssetIDByName("ic_message_delete"),
				title: "Anti Edit & Delete Logs",
				page: {
					title: "Anti Edit & Delete Logs",
					render: Log,
				},
			},
		)
	);

	return () => patches.forEach((x) => x());
};
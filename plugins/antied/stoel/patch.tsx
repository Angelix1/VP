import { plugin } from "@vendetta";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";

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
				key: "antied_setting",
				icon: getAssetIDByName("ic_edit_24px"),
				title: "Anti Edit & Delete Settings",
				page: {
					title: "Anti Edit & Delete Settings",
					render: Settings,
				},
			},
		),
		patchSettingsPin(
			() => true,
			() => <LogSection />,
			{
				key: "antied_logs",
				icon: getAssetIDByName("ic_message_delete"),
				title: "Anti Edit & Delete Logs",
				page: {
					title: "Anti Edit & Delete Logs",
					render: Log,
				},
			},
		)
	)

	return () => patches.forEach((x) => x());
};
import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { findByProps } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { clipboard } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts"
import { storage } from "@vendetta/plugin";

const { FormRow, FormIcon } = Forms;
const ActionSheet = findByProps("openLazy", "hideActionSheet");

const targetIcon = <FormIcon style={{ opacity: 1 }} source={getAssetIDByName("copy")} />;

storage.bool.copy_no_share ??= false
let en = storage.bool.copy_no_share;

// Just for a bit of separation
export default [
	en && before("openLazy", ActionSheet, ([component, key]) => {
		if (key !== "MediaShareActionSheet") return;
		component.then((instance) => {
			const unpatchInstance = after("default", instance, ([{ syncer }], res) => {
				React.useEffect(() => void unpatchInstance(), []);

				let source = syncer.sources[syncer.index.value];
				if (Array.isArray(source)) source = source[0];

				const url = source.sourceURI ?? source.uri;		
				const rows = res?.props?.children?.props?.children; 

				let share = rows.find(x => x.props?.label?.toLowerCase() == 'share');
				
				rows[rows.indexOf(share)] = (
					<FormRow
							leading={targetIcon}
							label={"Copy Image Link"}
							onPress={() => {
								ActionSheet.hideActionSheet()
								clipboard.setString(url)
								showToast("Image Url Copied", getAssetIDByName("toast_copy_link"))
							}}
					/>
				);
			})
		})
	})
]

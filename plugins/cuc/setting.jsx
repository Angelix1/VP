import * as util from "./util";

import { ReactNative } from "@vendetta/metro/common";
import { General, Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { find, findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";

const { openLazy, hideActionSheet } = findByProps("openLazy", "hideActionSheet");
const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image } = General;
const { FormIcon, FormSwitchRow, FormSwitch, FormRow, FormInput, FormDivider } = Forms;
const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");

function numToHex(numericColor) {
	const red = (numericColor >> 16) & 255;
	const green = (numericColor >> 8) & 255;
	const blue = numericColor & 255;
	return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
}

function createSwitch(id, label, sub, def, icon) {
	return { id, label, sub, def, icon }
}


const switches = [
	createSwitch("enableUsername", "Toggle for username", null, true, null),
	createSwitch("enableReply", "Toggle for replied messages", null, false, null),
	createSwitch("enableType", "Toggle for typing indicator", null, false, null),
	createSwitch(
		"enableToMyself", 
		"Apply color only to myself", 
		"Only Modify your own username color instead all members.",
		false, 
		null
	)
]

export default () => {
	useProxy(storage);
	
	const pc = (inp) => ReactNative.processColor(inp);
	
	const whenPressed = () => util?.openSheet(
		CustomColorPickerActionSheet, {
			color: (pc(storage?.colors?.hex) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				storage.colors.hex = hex
			//	showToast(storage.colors.hex)
			}
		}
	);
	
	return (
		<ScrollView>
			<FormRow
				label="Color"
				subLabel="Click to Update"
				onPress={whenPressed}
				trailing={
					<TouchableOpacity onPress={whenPressed}>
						<Image
							source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=' }}
							style={{ 
								width: 96, 
								height: 96,
								borderRadius: 10, 
								backgroundColor: storage?.colors?.hex || "#000"
							}}
      					/>
					</TouchableOpacity>
				}
			/>
			{ 
				switches?.map((obj, index) => {
					return (<>
						<FormRow 
							label={obj?.label}
							subLabel={obj?.sub}
							leading={obj?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(obj?.icon)} />}
							trailing={
								("id" in obj) ? (
									<FormSwitch
										value={storage?.switches[obj?.id] ?? obj?.def}
										onValueChange={ (value) => (storage.switches[obj?.id] = value) }
										/>
								) : undefined
							}
						/>
						{index !== switches?.length - 1 && <FormDivider />}
					</>)
				})
			}
		</ScrollView>
	);
};
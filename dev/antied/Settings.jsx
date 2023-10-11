import ListUsers from './pages/listUsers';
import * as Util from "./util";

import { NavigationNative, constants, React, stylesheet } from "@vendetta/metro/common";
import { findByProps, findByName } from '@vendetta/metro';
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";
import { semanticColors } from "@vendetta/ui";


const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;


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


const customizeableSwitches = [
	{
		id: "minimalistic",
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

const customizeableColors = [
	{
		id: "deletedMessageColor",
		title: "Customize Deleted Message Color",
		type: "default",
		defaultColor: "#E40303",
	},
	{
		id: "deletedMessageBackgroundColor",
		title: "Customize Deleted Background Message Color",
		type: "default",
		defaultColor: "#FF2C2F",
	}
]

const customizedableTexts = [
	{
		id: "deletedMessageBuffer",
		title: "Customize Deleted Message",
		type: "default",
		placeholder: "This message is deleted",
	},
	{
		id: "editedMessageBuffer",
		title: "Customize Edited Separator",
		type: "default",
		placeholder: "`[ EDITED ]`",
	}
]

/* settings IDs and Vars
{
    switches: {
        customizeable: false,
        useBackgroundColor: false,
        ignoreBots: false,
        minimalistic: true,
    },
    inputs: {
        deletedMessageColor: undefined,
        deletedMessageBackgroundColor: undefined,
        deletedMessageBuffer: undefined,
        editedMessageBuffer: undefined,
        ignoredUserList: []
    }
}
*/

export default () => {  
	useProxy(storage);
	
	const navigation = NavigationNative.useNavigation();
	useIsFocused();

	let users = storage?.inputs?.ignoredUserList ?? [];

	const listIgnore = () => {
		navigation.push("VendettaCustomPage", {
			title: `List of Ignored Users`,
			render: () => <ListUsers/>
		})
	}

	return (
		<ScrollView>
			<View style={{ marginTop: 20, marginBottom: 20 }}>

				<FormSection title="Plugin Setting" style={[styles.header]}>
					<FormRow 
						label='Customization'
						subLabel='Show customization for the plugin'
						leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_category_16px")} />}
						trailing={
							<FormSwitch
							value={storage?.switches?.customizeable ?? false}
							onValueChange={ (value) => (storage.switches.customizeable = value) }
							/>
						}
					/>

					{/* Divider */}
					{
						storage?.switches?.customizeable && (<>
							<FormSection title="Switches" />
							<FormDivider />
						</>)
					}				

					{/* Switches */}
					{
						storage?.switches?.customizeable && (<>
							<View style={[styles.subText]}>{
								customizeableSwitches?.map((obj, index) => {
									return (<>
										<FormRow 
											label={obj?.label}
											subLabel={obj?.subLabel}
											leading={obj?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(obj?.icon)} />}
											trailing={
												("id" in obj) ? (
													<FormSwitch
													value={storage?.switches[obj?.id] ?? obj?.default}
													onValueChange={ (value) => (storage.switches[obj?.id] = value) }
													/>
												) : undefined
											}
										/>
										{index !== customizeableSwitches?.length - 1 && <FormDivider />}
									</>)
								})
							}				
							</View>
						</>)
					}

					{/* Divider */}
					{
						storage?.switches?.customizeable && (<>
							<FormSection title="Colors Pickers" />
							<FormDivider />
						</>)
					}		

					{/* Color Pickers */}
					{
						storage?.switches?.customizeable && (<>
							<View style={[styles.subText]}>{
								customizeableColors?.map((obj) => {
									const whenPressed = () => Util?.openSheet(
										CustomColorPickerActionSheet, {
											color: Util?.colorConverter?.toInt(obj?.defaultColor),
											onSelect: (color) => {
												const value = Util?.colorConverter?.toHex(color)
												// console.log(color, value)
												storage.inputs[obj.id] = value
											}
										}
									);

									return (<>
										<FormRow
											label={obj?.title}
											subLabel="Click to Update"
											onPress={whenPressed}
											trailing={
												<TouchableOpacity onPress={whenPressed}>
													<Image
      													source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=' }}
      													style={{ 
      														width: 32, 
      														height: 32,
      														borderRadius: 10, 
      														backgroundColor: storage?.inputs[obj.id] || customizeableColors.find(x => x?.id == obj?.id)?.defaultColor || "#000"
      													}}
      												/>
												</TouchableOpacity>
											}
										/>
									</>)
								})
							}
							</View>
						</>)
					}

					{/* Divider */}
					{
						storage?.switches?.customizeable && (<>
							<FormSection title="Texts Variables" />
							<FormDivider />
						</>)
					}	

					{/* Texts Variables */}
					{
						storage?.switches?.customizeable && (<>
							<View style={[styles.subText]}>{
								customizedableTexts?.map((obj, index) => {
									return (<>
					                    <FormInput
					                    	title={obj?.title}
					                    	keyboardType={obj?.type}
					                    	placeholder={obj?.placeholder}
					                    	value={storage?.inputs[obj.id] ?? obj?.placeholder}
					                    	onChange={(val) => (storage.inputs[obj.id] = val.toString())}
					                    />
					                    {index !== customizedableTexts.length - 1 && <FormDivider />}
					                </>)
								})
							}				
							</View>
						</>)
					}

				</FormSection>
				
				<FormSection title="Ignore List Setting" style={[styles.header]}>
					<FormRow
						label="Add User to List"
						subLabel="List of ignored users for the plugin"
						leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_members")} />}
						onPress={listIgnore}
						trailing={
							<TouchableOpacity onPress={listIgnore}>
								<FormIcon style={{ opacity: 1 }} source={Add} />
							</TouchableOpacity>
						}
					/>
					<FormDivider />
				</FormSection>
				
			</View>
		</ScrollView>
		)
}

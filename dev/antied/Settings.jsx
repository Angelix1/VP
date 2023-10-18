import ListUsers from './pages/listUsers';
import * as Util from "./util";

import { NavigationNative, constants, React, ReactNative, stylesheet } from "@vendetta/metro/common";
import { findByProps, findByName } from '@vendetta/metro';
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";
import { semanticColors } from "@vendetta/ui";

import Slider from './ui/Slider'; // Thanks github.com/@fres621

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
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorPreview: {
		width: "75%",
		height: 100,
		marginBottom: 20,
	},
	row: {
		flexDirection: "row", 
		height: 80,
		width: "90%", 
		marginBottom: 20
	},
	border: {
		borderRadius: 12
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
	{
		id: "alwaysAdd",
		default: false,
		label: "Always Add Remove Edit History Button",
		subLabel: "Always add remove edit History button regardless if the message is edited or not.",
	},
	{
		id: "removeDismissButton",
		default: false,
		label: "Remove Dissmiss Message",
		subLabel: "Remove clickable Dismiss Message text from deleted ephemeral messages.",
	},
	{
		id: "addTimestampForEdits",
		default: false,
		label: "Add Edit Timestamp",
		subLabel: "Add Timestamp for edited messages.",
	}
]

const customizeableColors = [
	{
		id: "textColor",
		label: "Deleted Message Text Color",
		subLabel: "Click to customize Deleted Message Text Color",
		defaultColor: "#E40303",
	},
	{
		id: "backgroundColor",
		label: "Deleted Message Background Color",
		subLabel: "Click to customize Background Color",
		defaultColor: "#FF2C2F",
	},
	{
		id: "gutterColor",
		label: "Deleted Message Background Gutter Color",
		subLabel: "Click to customize Background Gutter Color",	
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
        alwaysAdd: false,
        darkMode: true,
        removeDismissButton: false,
        addTimestampForEdits: false
    },
    colors: {
        textColor: "#E40303",
        backgroundColor: "#FF2C2F",
        backgroundColorAlpha: "33",
        gutterColor: "#FF2C2F",
        gutterColorAlpha: "CC",
    },
    inputs: {
        deletedMessageBuffer: "This message is deleted",
        editedMessageBuffer: "`[ EDITED ]`",
        ignoredUserList: []
    }
}
*/

function convertAlphaToHex(percent) {
	if (percent < 0) {
		return '00';
	} else if (percent > 100) {
		return 'FF';
	} else {
		const hexValue = Math.round((percent / 100) * 255).toString(16);
		return hexValue.length === 1 ? `0${hexValue}` : hexValue;
	}
}

function convertHexAlphaToPercent(hexAlpha) {
  const decimalAlpha = parseInt(hexAlpha, 16);
  if (isNaN(decimalAlpha)) {
    return 0; // Handle invalid input
  }
  return Math.round((decimalAlpha / 255) * 100);
}

export default () => {  
	useProxy(storage);

	// const [alpha, setAlpha] = React.useState(255);
	const [BGAlpha, setBGAlpha] = React.useState(convertHexAlphaToPercent(storage?.colors?.backgroundColorAlpha) ?? 100);
	const [gutterAlpha, setGutterAlpha] = React.useState(convertHexAlphaToPercent(storage?.colors?.gutterColorAlpha) ?? 100);
	
	const navigation = NavigationNative.useNavigation();
	useIsFocused();
	

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
							<FormSection title="Text Variables" />
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

					{/* Divider */}
					{
						storage?.switches?.customizeable && (<>
							<FormSection title="Color Pickers" />
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
											color: Util?.colorConverter?.toInt(storage.colors[obj.id] || obj?.defaultColor || "#000"),
											onSelect: (color) => {
												const value = Util?.colorConverter?.toHex(color)
												// console.log(color, value)
												storage.colors[obj.id] = value
											}
										}
									);

									return (<>
										<FormRow
											label={obj?.label}
											subLabel={obj?.subLabel || "Click to Update"}
											onPress={whenPressed}
											trailing={
												<TouchableOpacity onPress={whenPressed}>
													<Image
      													source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=' }}
      													style={{ 
      														width: 32, 
      														height: 32,
      														borderRadius: 10, 
      														backgroundColor: storage?.colors[obj.id] || customizeableColors.find(x => x?.id == obj?.id)?.defaultColor || "#000"
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

					{ 
						storage?.switches?.customizeable && (<>
							<View style={[styles.subText]}>
								<View style={styles.container}>
									<FormRow 
										style={{ justifyContent: 'center', alignItems: 'center' }} 
										label={`Preview Style: ${storage?.switches?.darkMode ? "Light" : "Dark"} Mode`}
										subLabel={`Click to Switch Mode`}
										trailing={
											<FormSwitch
												value={storage?.switches?.darkMode ?? true}
												onValueChange={ (value) => (storage.switches.darkMode = value) }
											/>
										}
									/>

									<View style={[styles.row, styles.border, {overflow: "hidden", marginRight: 10}]}>
										<View style={
											{ 
												width: "2%",
												backgroundColor: `${storage.colors.gutterColor}${convertAlphaToHex(gutterAlpha)}`,
											}
										}/>
										<View style={
											{ 
												flex: 1,										
												backgroundColor: `${storage.colors.backgroundColor}${convertAlphaToHex(BGAlpha)}`,
												justifyContent: 'center', 
												alignItems: 'center',
											}
										}>
											<Text style={{
													fontSize: 20, 
													color: storage?.switches?.darkMode ? "black" : "white"
												}
											}> Low Effort Normal Example Message </Text>
											<Text style={{
													fontSize: 20, 
													color: storage.colors.textColor || "#000000"
												}
											}> Low Effort Deleted Example Message </Text>									
										</View>
									</View>	

						            <FormDivider />
									<FormRow label={`Background Color Alpha: ${BGAlpha}%`}/>
									<Slider 
						            	style={{marginBottom: 0, marginRight: 10}}
						            	value={BGAlpha}
						            	onSlide={(v)=>{
						            		setBGAlpha(v)
						            		storage.colors.backgroundColorAlpha = convertAlphaToHex(v);
						            	}} 
						            />

						            <FormDivider />
						            <FormRow label={`Background Gutter Alpha: ${gutterAlpha}%`}/>	
									<Slider 
						            	style={{marginBottom: 0, marginRight: 10}}
						            	value={gutterAlpha}
						            	onSlide={(v)=>{
						            		setGutterAlpha(v)
						            		// console.log(v, convertAlphaToHex(v))
						            		storage.colors.gutterColorAlpha = convertAlphaToHex(v);
						            	}} 
						            />
						        </View>
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

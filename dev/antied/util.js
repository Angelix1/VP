import { logger } from "@vendetta";
import { find, findByName, findByProps, findByStoreName } from "@vendetta/metro";

const { openLazy, hideActionSheet } = findByProps("openLazy", "hideActionSheet");

export function makeDefaults(object, defaults) {
	if (object != undefined) {
		if (defaults != undefined) {
			for (const key of Object.keys(defaults)) {
				if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
					if (typeof object[key] !== "object") object[key] = {};
					makeDefaults(object[key], defaults[key]);
				} 
				else {
					object[key] ??= defaults[key];
				}
			}
		}
	}
}

export function removeKey(key, obj) {
	let { [key]: foo, ...b} = obj;
	return b;
}

export function openSheet(sheet, props) {
	try {
		openLazy(
			new Promise((call) => call({ default: sheet })),
			"ActionSheet",
			props
		);
	} 
	catch (e) {
		logger.error(e.stack);
		showToast(
			"Got error when opening ActionSheet! Please check debug logs"
			);
	}
}

export const colorConverter = {
	toInt(hex) {
    	// Remove "#" if it exists
		hex = hex.replace(/^#/, '');
    	// Parse the hexadecimal string to an integer
		return parseInt(hex, 16);
	},
	toHex(integer) {
		// Convert the integer to a hexadecimal string
    	const hex = integer.toString(16).toUpperCase();
    	// Add "#" at the beginning
    	return "#" + hex;
    }
};

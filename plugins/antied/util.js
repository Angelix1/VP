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

export function calculateLighterValue(mainValue, increment) {
  // Calculate the secondary value by adding the increment to the main value
	let secondaryValue = mainValue + increment;

  // Ensure the secondary value is within the valid range (0 to 255 or 00 to FF in hexadecimal)
	secondaryValue = Math.min(secondaryValue, 255);

  // Convert the values to hexadecimal format (2 digits)
	const mainHex = mainValue.toString(16).padStart(2, '0');
	const secondaryHex = secondaryValue.toString(16).padStart(2, '0');

	return { main: mainHex, secondary: secondaryHex };
}

export const setOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;

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
	},
	HSLtoHEX(h, s, l) {
		l /= 100;
		const a = s * Math.min(l, 1 - l) / 100;
		const f = n => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}
};

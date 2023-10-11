import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";


const { DCDChatManager } = ReactNative.NativeModules;

export default (deletedMessagesArray) => before("updateRows", DCDChatManager, (r) => {
	let rows = JSON.parse(r[1]);

	const { deletedMessageColor, deletedMessageBackgroundColor, deletedMessageBuffer } = storage.inputs
	const { useBackgroundColor, minimalistic } = storage.switches

	function validateHex(input, defaultColor) {
		
		if(!input) input = defaultColor;

		const trimmedInput = input?.trim();
		if (trimmedInput.startsWith("#")) {
			const hexCode = trimmedInput.slice(1);

			if (/^[0-9A-Fa-f]{6}$/.test(hexCode)) {
				return "#" + hexCode.toUpperCase();
			}
		} 
		else {
			const hexCode = trimmedInput;
			if (/^[0-9A-Fa-f]{6}$/.test(hexCode)) {
				return "#" + hexCode.toUpperCase();
			}
		}
		
		return defaultColor || "#000";
	}

	function transformObject(obj, inputColor) {
		const compTypes = [
			"text",
			"heading",
			"s",
			"u",
			"em",
			"strong",
			"list",
			"blockQuote"
			];

		if (Array.isArray(obj)) {
			return obj.map(transformObject);
		} 
		else if (typeof obj === "object" && obj !== null) {
			const { content, type, target, items } = obj;

			if(!compTypes.includes(type)) return obj;

			if (type === "text" && content && content.length >= 1) {

				return {
					content: [{
						content: content,
						type: "text"
					}],
					target: "usernameOnClick",
					type: "link",
					context: {
						username: 1,
						medium: true,
						usernameOnClick: {
							action: "0",
							userId: "0",
							linkColor: ReactNative.processColor(`${inputColor?.toString()}`),
							messageChannelId: "0"
						}
					}
				};
			}

			const updatedContent = transformObject(content);
			const updatedItems = items ? items.map(transformObject) : undefined;

			if (updatedContent !== content || updatedItems !== items || !compTypes.includes(type)) {
				const updatedObj = { ...obj, content: updatedContent };

				if (type === "blockQuote" && target) {
					updatedObj.content = updatedContent;
					updatedObj.target = target;
				}

				if (type === "list") {
					if (updatedObj?.content) {
						delete updatedObj.content;
					}
				}

				if (items) {
					updatedObj.items = updatedItems;
				}

				return updatedObj;
			}
		}

		return obj;
	}

	rows.forEach((row) => {
		if(row?.type == 1) {
			if( deletedMessagesArray?.includes(row?.message?.id) ) {

				if(!minimalistic) {
					const savedColor = validateHex(deletedMessageColor, "E40303"); // Hex
					const newRow = transformObject(row?.message?.content, savedColor);

					row.message.content = newRow;
				}

				row.message.edited = deletedMessageBuffer || "This message is deleted";

				if(useBackgroundColor && !minimalistic) {
					const savedBGColor = validateHex(deletedMessageBackgroundColor, "FF2C2F");
					const BGForeGround = `${ savedBGColor.toString() }33`;
					const BGMask = `${ savedBGColor.toString() }CC`;

					row.backgroundHighlight = {
						backgroundColor: ReactNative.processColor(BGForeGround),
						gutterColor: ReactNative.processColor(BGMask),
					};
				}
			}
		}
	})

	r[1] = JSON.stringify(rows);
	return;
});
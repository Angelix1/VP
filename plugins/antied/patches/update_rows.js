import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

const { DCDChatManager } = ReactNative.NativeModules;

export default (deletedMessagesArray) => before("updateRows", DCDChatManager, (r) => {
	let rows = JSON.parse(r[1]);

	const { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha } = storage.colors
	const deletedText = storage.inputs?.deletedMessageBuffer
	const { useBackgroundColor, minimalistic, removeDismissButton } = storage.switches

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
			if (/^[0-9A-Fa-f]{6}$/.test(trimmedInput)) {
				return "#" + trimmedInput.toUpperCase();
			}
		}																
		
		return defaultColor || "#000";
	}

	function transformObject(obj, inputColor) {
		const charColor = inputColor?.toString();
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
			return obj.map(data => transformObject(data, charColor));
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
							linkColor: ReactNative.processColor(charColor),
							messageChannelId: "0"
						}
					}
				};
			}

			const updatedContent = transformObject(content, charColor);
			const updatedItems = items ? items.map(transformObject, charColor) : undefined;

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

	function updateEphemeralIndication(object, onlyYouText, dismissText) {
		if (object) {
			if (onlyYouText != undefined) {
				// Update "Only you can see this"
				object.content[0].content[0].content = onlyYouText+"  ";
			}
			if (dismissText == undefined) {
				// Update "Dismiss message"
				object.content[0].content.splice(1)
			}
		}
		return object;
	}

	function parseProxyUrl(originalUrl) {
		const regex = new RegExp(".+size=([0-9]+)\/https?\/")
		const decodedUrl = decodeURIComponent(originalUrl)

		const testRegex = decodedUrl?.match(regex)

		if(testRegex) {
			return {
				url: decodedUrl?.replace(regex, "https\:\/\/"),
				size: testRegex[1]
			}
		} 
		else {
			return {
				url: decodedUrl
			}
		}
	}

	rows.forEach((row) => {
		if(row?.type == 1) {
			
			if( deletedMessagesArray[row?.message?.id] ) {
				row.message.edited = (deletedText?.length > 0) ? deletedText : "This message is deleted";

				if(minimalistic == false) {
					const characterColor = validateHex(textColor, "#E40303")
					const appliedColor = transformObject(row?.message?.content, characterColor)
					row.message.content = appliedColor;
				}
				
				if(removeDismissButton) {
					row.message.ephemeralIndication = updateEphemeralIndication(
						row.message.ephemeralIndication,
						undefined,
						undefined,
					)
				}

				if(minimalistic == false && useBackgroundColor == true) {
					
					const BG = validateHex( `${backgroundColor}`, "#FF2C2F" );
					const GC = validateHex( `${gutterColor}`, "#FF2C2F");

					row.backgroundHighlight = {
						backgroundColor: ReactNative.processColor(`${BG}${backgroundColorAlpha}`),
						gutterColor: ReactNative.processColor(`${GC}${gutterColorAlpha}`)
					}
				}
			}
		}
	})

	r[1] = JSON.stringify(rows);
	return r[1];
});




/*
embeds: [ 
	{ 
		id: 'embed_7',
		type: 'rich',
		spoiler: '',
		obscure: '',
		obscureAwaitingScan: '',
		author: { 
			name: 'alexesix',
			iconURL: 'https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png',
			iconProxyURL: 'https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png' 
		},
		rawTitle: 'Server Avatar',
		title: [
			{ 
				content: 'Server Avatar', 
				type: 'text'
			}
		],
		image: { 
			url: 'https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png',
			proxyURL: 'https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png',
			width: 208,
			height: 208 
		},
		fields: [],
		borderLeftColor: 452984831,
		providerColor: -3880498,
		headerTextColor: -4867391,
		bodyTextColor: -2367775,
		backgroundColor: 452984831
	}
],

https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png
https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png
https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png
https://images-ext-1.discordapp.net/external/SxauDtdjXLg1IJw-f6TLJkXVq_-V1OhCCsC0-KpalLE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/791682875224490014/737f2ea62f64ee27e01402741630cc4e.png

*/
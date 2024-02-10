/* Severe barin damage */ 
/* Only gawd know what the fucj therse kode does */

import { before, after } from "@vendetta/patcher";
import { ReactNative } from "@vendetta/metro/common"
import { find, findByProps, findByStoreName, findByName } from "@vendetta/metro";

const { DCDChatManager } = ReactNative.NativeModules;

const WARIO = "https://cdn.discordapp.com/attachments/919655852724604978/1197224092554772622/9k.png";

export default () => before("updateRows", DCDChatManager, (args) => {
	let rows = JSON.parse(args[1]);

	for (const row of rows) {
		const { message } = row
		if(!message) continue;
		
		const WARIO_2_0 = "WARIO";
		const IDFK_Dischord_sheit = "?ex=65ba7cd3&is=65a807d3&hm=802329bcd8341bb5e83c054cc7c42d9381f071d4f481fe666284dcdff01a0f2e&";	

		message.avatarURL = WARIO; // + IDFK_Dischord_sheit
		message.tagText = WARIO_2_0;
		message.opTagText = WARIO_2_0;
		message.username = WARIO_2_0;

		if(message?.referencedMessage?.message) {
			
			message.referencedMessage.message.avatarURL = WARIO; // + IDFK_Dischord_sheit
			message.referencedMessage.message.tagText = WARIO_2_0;
			message.referencedMessage.message.opTagText = WARIO_2_0;
			message.referencedMessage.message.username = WARIO_2_0;
		}
	}

	args[1] = JSON.stringify(rows);
})

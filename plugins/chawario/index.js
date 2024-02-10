/* When coding this i got brain damage */

import { makeDefaults } from "../../lib/utility";
// import settingPage from "./setting";

import chatThing from "./patch/chat";

import { storage } from "@vendetta/plugin";

/*
makeDefaults(storage, {
	colors: {
		hex: "#DAFAF0",
	},
	switches: {
		enableUsername: true,
		enableReply: false,
		enableType: false,
		enableToMyself: false,
	},
})
*/

const patches = [];

export default {
	onLoad: () => {
		patches.push(
			chatThing()		
		)
	},
	onUnload: () => {
		patches.forEach(un => un());
	},
	// settings: settingPage
}

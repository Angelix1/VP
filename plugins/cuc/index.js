import settingPage from "./setting";
import { makeDefaults } from "./util";

import { before, after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";
import { React, ReactNative, FluxDispatcher, constants } from "@vendetta/metro/common"
import { find, findByProps, findByStoreName, findByName } from "@vendetta/metro";
import { General } from "@vendetta/ui/components";
import { semanticColors } from "@vendetta/ui";

const { Text } = General;

const ThemeStore = findByStoreName("ThemeStore");
const resolveSemanticColor = find(m => m.default?.internal?.resolveSemanticColor)?.default.internal.resolveSemanticColor
    ?? find(m => m.meta?.resolveSemanticColor)?.meta.resolveSemanticColor ?? (() => {});

const UserStore = findByStoreName("UserStore");
const RelationshipStore = findByStoreName("RelationshipStore");
const GuildMemberStore = findByStoreName("GuildMemberStore");
const TypingWrapper = findByProps("TYPING_WRAPPER_HEIGHT");
const { DCDChatManager } = ReactNative.NativeModules;

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

function resolveColor(s) {
	if(s?.colors?.hex) return ReactNative.processColor(s.colors.hex)
	return 0;
}

const patches = [];

export default {
	onLoad: () => {
		patches.push(
			before("updateRows", DCDChatManager, (args) => {
				let rows = JSON.parse(args[1]);
				
				for (const row of rows) {
					const { message } = row
					if(!message) continue;
					// console.log(message)
					
					const handleColor = (m) => { 
						return m.usernameColor = resolveColor(storage) 
					};

					function handleModification() {
						if(storage?.switches?.enableUsername) {
							handleColor(message)
						}						
						if(
							message?.referencedMessage?.message && 
							storage?.switches?.enableReply
						) {
							handleColor(message?.referencedMessage?.message)
						}						
					}
					
					if(
						storage?.switches?.enableToMyself && 
						(UserStore?.getCurrentUser?.()?.id == message?.authorId)
					) {
						handleModification()
					} 
					else if (!storage?.switches?.enableToMyself) {
						handleModification()
					}
				}
				args[1] = JSON.stringify(rows);
			}),
			
			after("default", TypingWrapper, ([{ channel }], res) => {
				if (!storage?.switches?.enableType) return;
				if (!res) return;
				const Typing = res.props?.children;
				const defaultTypingColor = resolveSemanticColor(ThemeStore.theme, semanticColors.HEADER_SECONDARY);
						
				const unpatchTyping = after("type", Typing, (_, res) => {
					React.useEffect(() => () => { unpatchTyping() }, []);
					const typingThing = res?.props?.children?.[0]?.props?.children?.[1]?.props;
			
					if (
						!typingThing || 
						!typingThing?.children || 
						typingThing?.children?.toLowerCase?.() === "several people are typing..."
					) return;
					
					const users = TypingWrapper.useTypingUserIds(channel.id).map(user => {
						const member = GuildMemberStore.getMember(channel.guild_id, user);
						const userobj = UserStore.getUser(user);
						const name = (member?.nick || RelationshipStore.getNickname(user) || userobj.globalName || userobj.username);
						const color = (storage?.colors?.hex || defaultTypingColor);
				
						return {displayName: name, displayColor: color};
					});
			
					function userElem(user) {
						return React.createElement( 
							Text, 
							{ 
								style: { 
									color: user.displayColor, 
									fontFamily: constants.Fonts.DISPLAY_SEMIBOLD
								}
							}, 
							user.displayName 
						);
					};
			
					if (!users || users.length < 1) return;
			
					typingThing.children = (
						users.length === 1 ? 
							[userElem(users[0]), " is typing..."] : 
							[
								...users.slice(0, users.length - 1).flatMap((el, i) => [userElem(el), i < (users.length-2) ? ", " : " and "]), 
								userElem(users[users.length - 1]), " are typing..."
							]
					)
				});
			}),
		)
	},
	onUnload: () => {
		patches.forEach(un => un());
	},
	settings: settingPage
}

import { before } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { storage } from "@vendetta/plugin";

const Message = findByProps("startEditMessage")

export default () => before('startEditMessage', Message, (args) => {

	let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
	Edited = Edited + '\n\n';

	const [channelId, messageId, msg] = args;
	const lats = msg.split(Edited);
	args[2] = lats[lats.length - 1];
	return args;
});
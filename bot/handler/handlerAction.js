const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEvents = require(
		process.env.NODE_ENV == "development"
			? "./handlerEvents.dev.js"
			: "./handlerEvents.js"
	)(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

	return async function (event) {
		// 🛡️ Anti-Inbox System 
		if (
			global.GoatBot.config.antiInbox == true &&
			(event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
			(event.senderID || event.userID || event.isGroup == false)
		)
			return;

		const message = createFuncMessage(api, event);

		// ⚙️ Prefix/No-Prefix Toggle Logic ✨
		// এখানে চেক করা হচ্ছে config-এ prefix মুড অন কি না
		const prefixMode = global.GoatBot.config.isPrefix; // এটা config থেকে আসবে
		const body = event.body || "";
		const prefix = global.GoatBot.config.prefix;

		if (prefixMode) {
			// যদি prefix on থাকে, আর মেসেজ যদি prefix দিয়ে শুরু না হয়, তবে রিটার্ন করবে
			if (body && !body.startsWith(prefix)) return;
		} else {
			// যদি prefix off থাকে (No Prefix Mode), তবে prefix দিয়ে মেসেজ দিলে তা ইগনোর করবে
			if (body && body.startsWith(prefix)) return;
		}

		await handlerCheckDB(usersData, threadsData, event);
		const handlerChat = await handlerEvents(event, message);
		if (!handlerChat) return;

		const {
			onAnyEvent, onFirstChat, onStart, onChat,
			onReply, onEvent, handlerEvent, onReaction,
			typ, presence, read_receipt
		} = handlerChat;

		onAnyEvent();

		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				onFirstChat();
				onChat();
				onStart();
				onReply();
				break;

			case "event":
				handlerEvent();
				onEvent();
				break;

			case "message_reaction":
				onReaction();

				const isAdmin = global.GoatBot.config.adminBot.includes(event.userID);

				// 🚫 Admin Reaction Action: Kick User
				if (event.reaction === "👎" && isAdmin) {
					api.removeUserFromGroup(event.senderID, event.threadID, err => {
						if (err) console.log(err);
					});
				}

				// 🗑️ Admin Reaction Action: Unsend Message
				if (
					isAdmin &&
					(event.reaction === "😡" ||
					 event.reaction === "😠" ||
					 event.reaction === "😾")
				) {
					message.unsend(event.messageID);
				}
				break;

			case "typ":
				typ();
				break;

			case "presence":
				presence();
				break;

			case "read_receipt":
				read_receipt();
				break;

			default:
				break;
		}
	};
};

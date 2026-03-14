module.exports = {
	config: {
		name: "noprefix",
		version: "1.0.0",
		role: 2,
		author: "MOHAMMAD-BADOL",
		description: "Enable or disable the bot prefix system",
		category: "system",
		guide: "{pn} on | off",
		countDown: 5
	},

	onStart: async function ({ args, message, role }) {
		if (role < 2) return message.reply("❌ This command is only for Bot Admins!");

		const status = args[0]?.toLowerCase();

		if (status === "on") {
			global.GoatBot.config.isPrefix = true;
			return message.reply("✅ Prefix system has been enabled! Commands now require a prefix. ⚡");
		} else if (status === "off") {
			global.GoatBot.config.isPrefix = false;
			return message.reply("🔄 No-Prefix system has been enabled! Commands will now work without a prefix. ✨");
		} else {
			return message.reply("⚠️ Usage: prefix on | off 📝");
		}
	}
};

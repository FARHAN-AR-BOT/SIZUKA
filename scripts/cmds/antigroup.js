module.exports = {
  config: {
    name: "antigroup",
    version: "1.5.0",
    author: "Milon Hasan",
    countDown: 5,
    role: 1, // Only Group Admins can use this
    category: "admin",
    shortDescription: { en: "Enable/Disable group name protection" },
    guide: { en: "{pn} on | off" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    // Settings initialize kora
    if (!global.antiGroupSettings) global.antiGroupSettings = {};

    if (!args[0]) {
      return api.sendMessage("⚠️ [ ERROR ]\n━━━━━━━━━━━━━━━━━━\nUse: .antigroup on (to enable)\nUse: .antigroup off (to disable)", threadID, messageID);
    }

    const mode = args[0].toLowerCase();

    if (mode === "on") {
      global.antiGroupSettings[threadID] = true;
      return api.sendMessage(
        `🛡️ [ 𝗔𝗡𝗧𝗜-𝗚𝗥𝗢𝗨𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 ]\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `✅ Status: ENABLED\n` +
        `👤 Action: Monitoring Name Changes\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Powered by Milon Hasan`, 
        threadID, messageID
      );
    } 
    else if (mode === "off") {
      global.antiGroupSettings[threadID] = false;
      return api.sendMessage(
        `🔓 [ 𝗔𝗡𝗧𝗜-𝗚𝗥𝗢𝗨𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 ]\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `❌ Status: DISABLED\n` +
        `━━━━━━━━━━━━━━━━━━`, 
        threadID, messageID
      );
    } 
    else {
      return api.sendMessage("⚠️ Invalid input! Please type: antigroup on/off", threadID, messageID);
    }
  }
};

const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "autoprayer",
  version: "5.1",
  role: 0,
  author: "ALVI-BOSS",
  description: "🕌 নামাজের সময় অটো মেসেজ + ভিডিও পাঠাবে",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  setTimeout(async () => {

    let prayerTimes = {};
    let sentToday = {}; 

    const loadPrayerTimes = async () => {
      try {
        const res = await axios.get(
          "http://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1"
        );

        if (!res.data || !res.data.data) return;

        const data = res.data.data.timings;

        prayerTimes = {
          Fajr: data.Fajr,
          Dhuhr: data.Dhuhr,
          Asr: data.Asr,
          Maghrib: data.Maghrib,
          Isha: data.Isha
        };

        sentToday = {};

        console.log("✅ Live Prayer Times Loaded:", prayerTimes);

      } catch (err) {
        console.error("❌ API Error:", err);
      }
    };

    await loadPrayerTimes();
    setInterval(loadPrayerTimes, 24 * 60 * 60 * 1000);

    const prayerMessages = {
      Fajr: {
        name: `╭•┄┅══❁🌺❁══┅┄•╮
•—»✨ফজর আজান✨«—•
╰•┄┅══❁🌺❁══┅┄•╯`,
        msg: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
আসসালামু আলাইকুম-!!🖤💫
প্রিয় মুসলিম ভাই ও বোন এখন ফজরের আজান দেওয়া হয়েছে!
সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন।
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
        video: "https://files.catbox.moe/gr8zqw.mp4"
      },

      Dhuhr: {
        name: `╭•┄┅══❁🌺❁══┅┄•╮
•—»✨যোহর আজান✨«—•
╰•┄┅══❁🌺❁══┅┄•╯`,
        msg: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
আসসালামু আলাইকুম-!!🖤💫
প্রিয় মুসলিম ভাই ও বোন এখন যোহরের আজান দেওয়া হয়েছে!
সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন।
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
        video: "https://files.catbox.moe/gr8zqw.mp4"
      },

      Asr: {
        name: `╭•┄┅══❁🌺❁══┅┄•╮
•—»✨আসর আজান✨«—•
╰•┄┅══❁🌺❁══┅┄•╯`,
        msg: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
আসসালামু আলাইকুম-!!🖤💫
প্রিয় মুসলিম ভাই ও বোন এখন আসরের আজান দেওয়া হয়েছে!
সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন।
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
        video: "https://files.catbox.moe/gr8zqw.mp4"
      },

      Maghrib: {
        name: `╭•┄┅══❁🌺❁══┅┄•╮
•—»✨মাগরিব আজান✨«—•
╰•┄┅══❁🌺❁══┅┄•╯`,
        msg: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
আসসালামু আলাইকুম-!!🖤💫
প্রিয় মুসলিম ভাই ও বোন এখন মাগরিবের আজান দেওয়া হয়েছে!
সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন।
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
        video: "https://files.catbox.moe/gr8zqw.mp4" 
      },

      Isha: {
        name: `╭•┄┅══❁🌺❁══┅┄•╮
•—»✨এশা আজান✨«—•
╰•┄┅══❁🌺❁══┅┄•╯`,
        msg: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
আসসালামু আলাইকুম-!!🖤💫
প্রিয় মুসলিম ভাই ও বোন এখন এশার আজান দেওয়া হয়েছে!
সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন।
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
        video: "https://files.catbox.moe/gr8zqw.mp4"
      }
    };

    console.log("✅ Live Prayer Auto System Started...");

    const sendPrayerMessage = async () => {

      const now = moment().tz("Asia/Dhaka").format("HH:mm");

      for (const key in prayerTimes) {

        if (prayerTimes[key] === now && !sentToday[key]) {

          sentToday[key] = true; 

          const prayer = prayerMessages[key];
          const today = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

          const finalMessage =
`━━━━━━━━━━━━━━━━━━━
${prayer.name}

${prayer.msg}

🕒 𝐓𝐢𝐦𝐞: ${prayerTimes[key]}
📅 𝐃𝐚𝐭𝐞: ${today}
🤖 𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫:-𝐅𝐚𝐫𝐡𝐚𝐧-𝐤𝐡𝐚𝐧
━━━━━━━━━━━━━━━━━━━`;

          try {
            const allThreads = await api.getThreadList(100, null, ["INBOX"]);
            const groups = allThreads.filter(t => t.isGroup);

            for (const thread of groups) {

              let attachment = null;

              try {
                const res = await axios.get(prayer.video, { responseType: "stream" });
                attachment = res.data;
              } catch {}

              await api.sendMessage({
                body: finalMessage,
                attachment
              }, thread.threadID);
            }

            console.log(`✅ ${key} sent`);

          } catch (err) {
            console.error("❌ Send Error:", err);
          }
        }
      }
    };

    setInterval(sendPrayerMessage, 30000);

  }, 5000);
};

module.exports.onStart = () => {};

// checker.js - loops through tracked shows, checks AniList, stores notifications when new ep found
const db = require('./db');
const anilist = require('./anilist');

async function runCheck() {
  const list = db.listAllTracked();
  for (const item of list) {
    try {
      const media = await anilist.getById(item.animeid);
      if (!media) continue;
      const next = media.nextAiringEpisode;
      if (!next) continue;

      const nextEp = next.episode;
      if ((item.nextepisode || 0) !== nextEp && nextEp > (item.last_seen || 0)) {
        // update DB
        db.updateNextEpisodeById(item.id, nextEp, next.airingAt);
        db.addNotification(item.id, nextEp);
        console.log(`New episode detected for ${item.romaji_title}: ${nextEp}`);
      }
    } catch (err) {
      console.error('Error checking', item.romaji_title, err.message || err);
    }
  }
}

module.exports = { runCheck };

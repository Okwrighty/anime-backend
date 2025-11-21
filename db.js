// db.js - simple SQLite storage (better-sqlite3)
const Database = require('better-sqlite3');
const db = new Database('watchlist.db');

// tracked_shows table: stores per-client tracked shows
db.prepare(`
CREATE TABLE IF NOT EXISTS tracked_shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT,
  animeid INTEGER,
  romaji_title TEXT,
  last_seen INTEGER DEFAULT 0,
  nextepisode INTEGER DEFAULT 0,
  airingat INTEGER DEFAULT 0
)`).run();

// notifications table: simple history of found new episodes
db.prepare(`
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  watch_id INTEGER,
  notified_episode INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now'))
)`).run();

module.exports = {
  addOrUpdateTracked(clientId, animeid, romajiTitle, lastSeen) {
    const row = db.prepare('SELECT id FROM tracked_shows WHERE client_id=? AND animeid=?').get(clientId, animeid);
    if (row) {
      db.prepare('UPDATE tracked_shows SET last_seen=? WHERE id=?').run(lastSeen, row.id);
      return row.id;
    }
    const info = db.prepare('INSERT INTO tracked_shows (client_id, animeid, romaji_title, last_seen) VALUES (?,?,?,?)')
      .run(clientId, animeid, romajiTitle, lastSeen);
    return info.lastInsertRowid;
  },
  listTrackedForClient(clientId) {
    return db.prepare('SELECT * FROM tracked_shows WHERE client_id=?').all(clientId);
  },
  listAllTracked() {
    return db.prepare('SELECT * FROM tracked_shows').all();
  },
  updateNextEpisodeById(id, nextEp, airingAt) {
    db.prepare('UPDATE tracked_shows SET nextepisode=?, airingat=? WHERE id=?').run(nextEp, airingAt, id);
  },
  addNotification(watchId, episode) {
    db.prepare('INSERT INTO notifications (watch_id, notified_episode) VALUES (?,?)').run(watchId, episode);
  },
  getLatestNotification(watchId) {
    return db.prepare('SELECT * FROM notifications WHERE watch_id=? ORDER BY id DESC LIMIT 1').get(watchId);
  }
};

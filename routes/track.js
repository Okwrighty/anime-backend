// routes/track.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const anilist = require('../anilist');

// add to watchlist
router.post('/add', async (req, res) => {
  try {
    const { clientId, animeid, romajiTitle, lastSeen } = req.body;
    if (!clientId || !animeid) return res.status(400).json({ error: 'bad_request' });
    const id = db.addOrUpdateTracked(clientId, animeid, romajiTitle || '', lastSeen || 0);
    res.json({ id });
  } catch (err) {
    console.error('track add', err);
    res.status(500).json({ error: 'track_failed' });
  }
});

// list watchlist for client
router.get('/list', (req, res) => {
  const clientId = req.query.clientId;
  if (!clientId) return res.status(400).json({ error: 'no_client' });
  const rows = db.listTrackedForClient(clientId);
  res.json(rows);
});

module.exports = router;

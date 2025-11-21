// routes/search.js
const express = require('express');
const router = express.Router();
const anilist = require('../anilist');

router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'missing query' });
    const results = await anilist.searchAniList(q, 10);
    // return small payload
    const slim = results.map(m => ({
      id: m.id,
      title: m.title,
      cover: m.coverImage?.large || m.coverImage?.medium || null,
      status: m.status,
      nextAiringEpisode: m.nextAiringEpisode || null
    }));
    res.json(slim);
  } catch (err) {
    console.error('search error', err);
    res.status(500).json({ error: 'search_failed' });
  }
});

module.exports = router;

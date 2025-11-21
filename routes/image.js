// routes/image.js - proxy image to avoid CORS; callers pass ?url=<image-url>
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).send('missing url');
    const r = await fetch(url);
    const buf = await r.buffer();
    const ctype = r.headers.get('content-type') || 'image/jpeg';
    res.set('Content-Type', ctype);
    res.send(buf);
  } catch (err) {
    console.error('image proxy error', err);
    res.status(500).send('error');
  }
});

module.exports = router;

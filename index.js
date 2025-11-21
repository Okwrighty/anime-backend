// index.js - main server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cron = require('node-cron');

const searchRoutes = require('./routes/search');
const trackRoutes = require('./routes/track');
const statusRoutes = require('./routes/status');
const imageRoutes = require('./routes/image');

const checker = require('./checker');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/api/search', searchRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/image', imageRoutes);

// scheduled checks (every 10 minutes)
cron.schedule('*/10 * * * *', async () => {
  console.log('Scheduled check running', new Date().toISOString());
  await checker.runCheck();
});

// run one check at startup
checker.runCheck().catch(err => console.error('Startup check error', err));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

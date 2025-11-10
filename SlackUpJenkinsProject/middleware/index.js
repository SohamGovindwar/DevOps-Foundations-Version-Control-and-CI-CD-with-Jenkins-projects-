require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Load environment vars
const {
  SLACK_SIGNING_SECRET,
  JENKINS_URL,
  JENKINS_USER,
  JENKINS_API_TOKEN,
  JENKINS_JOB_NAME,
  JENKINS_TRIGGER_TOKEN
} = process.env;

// Verify Slack request
function verifySlack(req) {
  const ts = req.headers['x-slack-request-timestamp'];
  const sig = req.headers['x-slack-signature'];
  const body = new URLSearchParams(req.body).toString();
  const baseString = `v0:${ts}:${body}`;
  const mySig = 'v0=' + crypto.createHmac('sha256', SLACK_SIGNING_SECRET)
                              .update(baseString)
                              .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(mySig, 'utf8'), Buffer.from(sig, 'utf8'));
}

app.post('/slack/command', async (req, res) => {
  if (!verifySlack(req)) {
    return res.status(400).send('Invalid signature');
  }

  const { text, user_name } = req.body;
  res.json({
    response_type: 'ephemeral',
    text: `🧩 Received deploy command from *${user_name}*. Triggering Jenkins build...`
  });

  try {
    await axios.post(`${JENKINS_URL}/job/${JENKINS_JOB_NAME}/build?token=${JENKINS_TRIGGER_TOKEN}`, {}, {
      auth: { username: JENKINS_USER, password: JENKINS_API_TOKEN }
    });
    console.log('✅ Jenkins job triggered successfully');
  } catch (err) {
    console.error('❌ Failed to trigger Jenkins:', err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack middleware running on port ${PORT}`));

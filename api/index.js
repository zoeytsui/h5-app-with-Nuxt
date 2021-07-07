const express = require('express');
const app = express();
const lib = require('./_lib.js')

app.use(express.json());

app.all('/sign', (req, res) => {
  res.json({ sign: lib.getSign(req.body) });
})

app.all('/timestamp', async (req, res) => {
  let result = await lib.getTimestamp();
  res.json({ timestamp: result });
})

module.exports = app
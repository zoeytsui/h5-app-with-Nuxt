const express = require('express');
const app = express();
const lib = require('./_lib.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/sign', (req, res) => {
  res.json({ sign: lib.getSign(req.body) });
})

app.all('/timestamp', async (req, res) => {
  let result = await lib.getTimestamp();
  res.json({ timestamp: result });
})

let encryptedText, signedText;
app.all('/deposit', async (req, res) => {
  encryptedText = req.body.encryptedText;
  signedText = req.body.signedText;
  res.redirect(`${req.protocol}://${req.get('host')}/wallet/deposit`)
})

app.all('/deposit_data', async (req, res) => {
  res.send({ data: { encryptedText: encryptedText, signedText: signedText } });
})

module.exports = app
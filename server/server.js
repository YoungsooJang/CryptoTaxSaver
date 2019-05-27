const express = require('express');
const path = require('path');
const cors = require('cors');
const request = require('request');
const { sign } = require('jsonwebtoken');
const queryEncode = require('querystring').encode;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'public/')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let accessKey;
let secretKey;

app.post('/setKey', (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  accessKey = req.body.accessKey;
  // eslint-disable-next-line prefer-destructuring
  secretKey = req.body.secretKey;

  res.send('success');
});

app.get('/api/getOrders', (req, res) => {
  const query = queryEncode({ state: 'done', page: 1, order_by: 'desc' });
  const payload = {
    access_key: accessKey,
    nonce: new Date().getTime(),
    query,
  };
  const token = sign(payload, secretKey);

  const options = {
    method: 'GET',
    url: `https://api.upbit.com/v1/orders?${query}`,
    headers: { Authorization: `Bearer ${token}` },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send({ body });
  });
});

app.listen(PORT, () => {
  console.log(`Check out the app at http://localhost:${PORT}`);
});

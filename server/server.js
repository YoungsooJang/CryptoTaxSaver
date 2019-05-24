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

app.get('/api/getOrders', (req, res) => {
  const { accessKey, secretKey } = req.query;
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

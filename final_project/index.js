const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const users = require('./router/auth_users.js').users;
const secretKey = require('./secret-key.js');

const PORT = 8000;
const app = express();

app.use(express.json());

app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true
  })
);

app.use('/customer/auth/*', function auth(req, res, next) {
  const { username, password } = req.body;

  if (username && password) {
    users.push({ username, password });
    const token = jwt.sign({ username: username }, secretKey, {
      expiresIn: '1h'
    });
    req.session.authorization = { accessToken: token };
    return res.json({ token });
  }

  res.status(403).json({ message: 'Invalid credentials' });
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));

module.exports.secretKey = secretKey;

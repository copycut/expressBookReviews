const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
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

app.use(session({ secret: secretKey, resave: true, saveUninitialized: true }));

app.use('/customer/auth/*', function auth(req, res, next) {
  if (!req.session.authorization) {
    return res.status(403).json({ message: 'User not logged in' });
  }

  const token = req.session.authorization['accessToken'];

  jwt.verify(token, secretKey, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'User not authenticated' });
    }
    req.user = decodedUser;
    next();
  });
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));

module.exports.secretKey = secretKey;

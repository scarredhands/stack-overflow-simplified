const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (err) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }
};

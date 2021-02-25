const jwt = require('jsonwebtoken');
const { userTable } = require('../db/users');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const _ = jwt.verify(token, process.env.JWT_SECRET);
    const exists = userTable.exists(token);

    if (!exists) {
      throw new Error();
    }

    req.token = token;
    next();
  } catch (e) {
    res.status(401).send();
  }
};

module.exports = auth;

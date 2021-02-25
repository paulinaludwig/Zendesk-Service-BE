const jwt = require('jsonwebtoken');

class UserTable {
  tokens = [];
  appPassword;

  constructor() {
    this.appPassword = process.env.APP_PASSWORD;
  }

  isValid(password) {
    return this.appPassword === password;
  }

  exists(token) {
    return this.tokens.includes(token);
  }

  add() {
    const token = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    this.tokens.push(token);
    return token;
  }

  remove(token) {
    this.tokens = [...this.tokens].filter((o) => o !== token);
  }
}

const userTable = new UserTable();

module.exports = {
  userTable,
};

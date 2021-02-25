const express = require('express');
const { userTable } = require('../db/users');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users/login', (req, res) => {
  try {
    const { password } = req.body;

    if (!userTable.isValid(password)) {
      throw new Error('Unauthorized');
    }

    const token = userTable.add();
    res.send({
      token,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/users/logout', auth, (req, res) => {
  try {
    userTable.remove(req.token);
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

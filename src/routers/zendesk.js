const express = require('express');
const auth = require('../middleware/auth');
const { routes } = require('../config/routes');
const axios = require('axios');
const { appendParams, appendParams2 } = require('../util/util');

const router = new express.Router();

router.get('/zendesk/endpoints', auth, (_, res) => {
  try {
    const publicEndpoints = routes.filter((o) => !o.automated);
    res.send(publicEndpoints);
  } catch (e) {
    res.status(400).send();
  }
});

routes
  .filter((o) => !o.automated)
  .forEach((o) => {
    const expressURI = appendParams(o.route, o.params);
    router[o.type.toLowerCase()](expressURI, auth, async (req, res) => {
      try {
        const { body, params } = req;
        let zendeskURI = appendParams2(o.route, params);

        const { data } = await axios({
          method: o.type,
          data: body,
          url: zendeskURI,
        });

        res.send(data);
      } catch (e) {
        res.status(400).send();
      }
    });
  });

module.exports = router;

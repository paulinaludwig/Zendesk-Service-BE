const axios = require('axios');
const schedule = require('node-schedule');
const { routes } = require('../config/routes');
const router = require('../routers/user');

// TODO maybe add winston for all the api calls + tasks being executed?
const enableTasks = process.env.ENABLE_TASKS === 'TRUE';

routes
  .filter((o) => o.automated && enableTasks)
  .forEach((route) => {
    const job = schedule.scheduleJob(route.interval, async () => {
      try {
        const { data } = await axios({
          method: router.type,
          url: route.route,
        });

        console.log('data', data.tickets.length);
      } catch (e) {
        console.log(e.message);
      }
    });
  });

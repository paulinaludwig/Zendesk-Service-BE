require('dotenv').config();
require('./config/api');
require('./db/users');
require('./tasks/tasks');
const express = require('express');
const userRouter = require('./routers/user');
const zendeskRouter = require('./routers/zendesk');

const app = express();
var cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(zendeskRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

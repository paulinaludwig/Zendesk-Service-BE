const { getParams } = require('../util/util');

// TODO add more routes

const Type = Object.freeze({
  GET: 'GET',
  PUT: 'PUT',
});

const Category = Object.freeze({
  articles: 'articles',
  tickets: 'tickets',
  users: 'users'
});

const routes = [
  {
    name: 'Update Ticket',
    category: Category.tickets,
    type: Type.PUT,
    route: '/api/v2/tickets/{ticket_id}',
    params: getParams('/api/v2/tickets/{ticket_id}'),
    automated: false,
  },
  {
    name: '',
    category: '',
    type: Type.GET,
    route: '/api/v2/tickets',
    automated: true,
    interval: '*/5 * * * *',
  },
];

module.exports = {
  routes,
};

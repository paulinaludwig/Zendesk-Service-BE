const { getParams, getQuery } = require('../util/util');

// TODO add more routes

const Type = Object.freeze({
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST'
});

const Category = Object.freeze({
  articles: 'articles',
  tickets: 'tickets',
  users: 'users'
});

const routes = [
  // Tickets
  {
    name: 'Update Ticket',
    category: Category.tickets,
    type: Type.PUT,
    route: '/api/v2/tickets/{ticket_id}',
    params: getParams('/api/v2/tickets/{ticket_id}'),
    automated: false,
  },
  {
    name: 'Delete Ticket',
    category: Category.tickets,
    type: Type.DELETE,
    route: '/api/v2/tickets/{ticket_id}',
    params: getParams('/api/v2/tickets/{ticket_id}'),
    automated: false,
  },
  {
    name: 'Delete Tickets',
    category: Category.tickets,
    type: Type.DELETE,
    route: '/api/v2/tickets/destroy_many?ids={ids}',
    params: getQuery('/api/v2/tickets/destroy_many?ids={ids}'),
    automated: false,
  },
  {
    name: 'Create Ticket',
    category: Category.tickets,
    type: Type.POST,
    route: '/api/v2/tickets',
    automated: false,
  },
  {
    name: 'Get Ticket',
    category: Category.tickets,
    type: Type.GET,
    route: '/api/v2/tickets/{ticket_id}',
    params: getParams('/api/v2/tickets/{ticket_id}'),
    automated: false,
  },
  // Users 
  {
    name: 'Update User',
    category: Category.users,
    type: Type.PUT,
    route: '/api/v2/users/{user_id}',
    params: getParams('/api/v2/users/{user_id}'),
    automated: false,
  },
  {
    name: 'Delete User',
    category: Category.users,
    type: Type.DELETE,
    route: '/api/v2/users/{user_id}',
    params: getParams('/api/v2/users/{user_id}'),
    automated: false,
  },
  {
    name: 'Create User',
    category: Category.users,
    type: Type.POST,
    route: '/api/v2/users',
    automated: false,
  },
  {
    name: 'Get User',
    category: Category.users,
    type: Type.GET,
    route: '/api/v2/users/{user_id}',
    params: getParams('/api/v2/users/{user_id}'),
    automated: false,
  },
  // Articles
  {
    name: 'Update Article',
    category: Category.articles,
    type: Type.PUT,
    route: '/api/v2/help_center/en-us/articles/{article_id}',
    params: getParams('/api/v2/help_center/en-us/articles/{article_id}'),
    automated: false,
  },
  {
    name: 'Delete article',
    category: Category.articles,
    type: Type.DELETE,
    route: '/api/v2/help_center/en-us/articles',
    params: getParams('/api/v2/help_center/en-us/articles/{article_id}'),
    automated: false,
  },
  {
    name: 'Create Article',
    category: Category.articles,
    type: Type.POST,
    route: '/api/v2/articles',
    automated: false,
  },
  {
    name: 'Get Article',
    category: Category.articles,
    type: Type.GET,
    route: '/api/v2/articles/{article_id}',
    params: getParams('/api/v2/articles/{article_id}'),
    automated: false,
  },
  // Automations 
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

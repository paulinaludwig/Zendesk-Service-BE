const getParams = (url) =>
  url.match(/{(\w+)}/g).map((o) => {
    const [, params] = o.match(/{(\w+)}/);
    return params;
  });

const getQuery = (url) => 
  url.match(/\?(.*)/g).map((o) => {
    const [, params ] = o.match(/{(\w+)}/);
      return params
  });


const appendParams = (url, params = []) => {

  if (params.length === 0) {
    return url;
  }
  let uri = url;

  params.forEach((p) => {
    uri = uri.replace(`{${p}}`, `:${p}`);
  });

  return uri;
};

// TODO change name
const appendParams2 = (url, params) => {
  let uri = url;

  for (const [key, value] of Object.entries(params)) {
    uri = uri.replace(`{${key}}`, value);
  }

  return uri;
};

module.exports = {
  getParams,
  getQuery,
  appendParams,
  appendParams2,
};

var url = require('url');

var accessTokens = {};

exports.redirect = function (req, render) {
  var uri = url.parse(req.url, true);
  if (!uri.query.hasOwnProperty('access_token')) {
    render({view: true, locals: {redirect: true}});
  }
  else {
    var state = uri.query.state;
    var token = uri.query.access_token;
    if (state && token) {
      accessTokens[state] = token;
      render({view: true, locals: {redirect: false, success: true}});
    }
    else {
      render({view: true, locals: {redirect: false, success: false}});
    }
  }
};

exports.token = function (req, render) {
  var uri = url.parse(req.url, true);
  if (uri.query.key) {
    var token = accessTokens[uri.query.key];
    if (token) {
      render({json: {access_token: token}});
    }
    else {
      render({json: {error_name: 'no_token', error_message: 'No token was found for the given key'}, status: 404});
    }
  }
  else {
    render({json: {error_name: 'no_key', error_message: 'No key was provided to fetch token with'}, status: 400});
  }
};

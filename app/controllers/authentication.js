var url = require('url');

var accessTokens = {};

exports.index = function () {
  this.redirect('http://stackapps.com/q/7271/29659');
};

exports.redirect = function (req) {
  var uri = url.parse(req.url, true);
  if (uri.query.error && uri.query.error === "true") {
    this.render({view: true, locals: {redirect: false, success: false}});
  }
  else if (!uri.query.access_token && !uri.query.state) {
    this.render({view: true, locals: {redirect: true, success: false}});
  }
  else {
    var state = uri.query.state;
    var token = uri.query.access_token;
    if (state && token) {
      accessTokens[state] = token;
      this.render({view: true, locals: {redirect: false, success: true}});
    }
    else {
      this.render({view: true, locals: {redirect: false, success: false}});
    }
  }
};

exports.token = function (req) {
  var uri = url.parse(req.url, true);
  if (uri.query.key) {
    var token = accessTokens[uri.query.key];
    if (token) {
      delete accessTokens[uri.query.key];
      this.render({json: {access_token: token}, headers: {'Access-Control-Allow-Origin': '*'}});
    }
    else {
      this.render({json: {error_name: 'no_token', error_message: 'No token was found for the given key'}, status: 404,
                   headers: {'Access-Control-Allow-Origin': '*'}});
    }
  }
  else {
    this.render({json: {error_name: 'no_key', error_message: 'No key was provided to fetch token with'}, status: 400,
                 headers: {'Access-Control-Allow-Origin': '*'}});
  }
};

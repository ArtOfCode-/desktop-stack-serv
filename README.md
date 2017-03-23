# desktop-stack-serv
Auth server for desktop applications authenticating with the Stack Exchange API.

## What?
The [Stack Exchange API](https://api.stackexchange.com) enables applications to get data about Stack Exchange sites or
users. It also supports write actions such as creating posts or comments, flagging, voting, and so on. To do the latter,
applications must authenticate to get a write token for a user.

For server-based applications, this is trivial. However, for client-based applications, it's not so easy - either the
application's maintainers must host a web server of their own, or must ask users to go through processes that less
technical users may find difficult.

This project solves that issue by making an open-source token server available. Instead of hosting their own web
server, project maintainers can use this server, which is available at `https://auth.artofcode.co.uk/`.

## How?
Very simple.

 - When creating your app on [Stack Apps](https://stackapps.com/), enter `artofcode.co.uk` as the OAuth domain, and
   enable client-side (implicit) authentication flow.
 - Follow the API's [documentation](https://api.stackexchange.com/docs/authentication) for using the implicit flow.
   You should use a value of `https://auth.artofcode.co.uk/auth/redirect` for the `redirect_uri` parameter, and you
   should generate a UUID or equivalent random token (a SHA256 hash of a random value, for example). You should pass
   this to the API as the `state` parameter.
 - The user authorizes your app, and is redirected to `redirect_uri`. DSS stores the access token against the `state`
   value.
 - The user returns to your app, and informs you that they have completed authentication. Your app should now make a
   HTTP GET request to `https://auth.artofcode.co.uk/auth/token?key=<uuid>`, where the value of the `key` parameter is
   the UUID or random token you generated earlier. A JSON object containing one key, `access_token`, will be returned.

## Notes
 - Make sure the random token you generate for the `state` parameter is URL-safe.
 - **Don't** generate a token based on the current time; that opens the door for app collisions, which could be bad.
 - If there's no token stored when you call `/auth/token`, you'll get a JSON object containing `error_name` and
   `error_message` parameters. You'll also get this if you don't pass a `key` parameter.

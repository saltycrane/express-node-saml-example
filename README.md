# express-passport-saml-example

Example Express.js, Passport.js OneLogin SAML SSO authentication app using:

- https://medium.com/brightlab-techblog/implement-single-sign-on-saml-strategy-with-node-js-passport-js-e8b01ff79cc3
- https://www.antoniogioia.com/saml-sso-setup-with-express-and-passport/
- https://github.com/gbraad/passport-saml-example/
- https://expressjs.com/en/resources/middleware/cookie-session.html

## OneLogin configuration

- create OneLogin developer account here: https://developers.onelogin.com/
- for example, use the domain `your-domain`
- at https://your-domain-dev.onelogin.com/admin2/apps select "Add App" > "SAML Custom Connector (Advanced)"
- on "Configuration" tab, set the following 5 fields:
  - "Audience (EntityID)" [1]: `your-example-app`
  - "Recipient": `your-example-app`
  - "ACS (Consumer) URL Validator*": `http://localhost:3000/login/sso/callback`
  - "ACS (Consumer) URL*": `http://localhost:3000/login/sso/callback`
  - "SAML signature event" [1]: "Both"

[1] required as of `node-saml` v4.0.0

## Set environment variables

- copy `.env.example` to `.env` and change the following:
  - `SSO_ENTRYPOINT`: "SSO" tab > "SAML 2.0 Endpoint (HTTP)"
  - `SSO_CERT`: "SSO" tab > "X.509 Certificate" > "View Details" > "X.509 Certificate" with "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" and newlines removed
  - `SSO_COOKIE_SESSION_SECRET`: generate or make up a secret string
  
Note: `SSO_ISSUER` should be "Recipient" on the "Configuration" tab and `SSO_CALLBACK_URL` should be "ACS (Consumer) URL*" on the "Configuration" tab.

**Example `.env`**

``` sh
SSO_ENTRYPOINT='https://your-domain-dev.onelogin.com/trust/saml2/http-post/sso/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

SSO_ISSUER='your-example-app'

SSO_CALLBACK_URL='http://localhost:3000/login/sso/callback'

SSO_CERT='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX='

SSO_COOKIE_SESSION_SECRET='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

## Run app and test

- install Node.js v16
- install dependencies and run the app

    ``` sh
    npm install
    node app.js
    ```

- go to http://localhost:3000 in an Incognito window of your web browser
- click "Login"
- get redirected to the OneLogin login page enter username and password
- get redirected to http://localhost:3000/login/sso/callback which is redirected to http://localhost:3000 which displays the user parameters including email


## Sequence of requests

1. GET http://localhost:3000/login/sso
2. GET https://your-domain-dev.onelogin.com/trust/saml2/http-post/sso/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
3. POST http://localhost:3000/login/sso/callback
4. GET http://localhost:3000/ (with user session cookie)


## Links

- https://www.passportjs.org/concepts/authentication/
- https://github.com/node-saml/passport-saml
- https://github.com/expressjs/session
- https://developers.onelogin.com/
- https://medium.com/brightlab-techblog/implement-single-sign-on-saml-strategy-with-node-js-passport-js-e8b01ff79cc3
- https://www.antoniogioia.com/saml-sso-setup-with-express-and-passport/
- https://expressjs.com/en/resources/middleware/cookie-session.html
- https://github.com/gbraad/passport-saml-example/

## Troubleshooting

### "Access Denied You do not have access to this application. Please contact your administrator."

 - ensure your user is added to the default role for the app in the OneLogin admin UI.
   - go to https://your-domain.onelogin.com/roles
   - select the "Default" role
   - select the "Users" tab
   - ensure your user is added to that role or add it

### Error: Invalid signature

- in the OneLogin admin UI, in the "Configuration" tab, ensure that "SAML signature element" is set to "Both"
- alternatively, as a less secure option, add the following configuration to the `passport-saml` `Strategy`: `wantAssertionsSigned: false`.
- `node-saml` changed in v4.0.0 to require all assertions be signed. See https://github.com/node-saml/node-saml/pull/177

### Error: SAML assertion AudienceRestriction has no Audience value

- in `node-saml`, `audience` defaults to the value of `issuer`
- in the OneLogin admin UI, in the "Configuration" tab, ensure that "Audience (EntityID)" is the same as `issuer`. (In this example it is the value of "Recipient", `your-example-app`)


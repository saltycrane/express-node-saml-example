# express-passport-saml-example

Example Express.js, Passport.js OneLogin SAML SSO authentication app using https://medium.com/brightlab-techblog/implement-single-sign-on-saml-strategy-with-node-js-passport-js-e8b01ff79cc3

## OneLogin configuration

- create OneLogin developer account here: https://developers.onelogin.com/
- for example, use the domain `your-domain`
- at https://your-domain-dev.onelogin.com/admin2/apps select "Add App" > "SAML Custom Connector (Advanced)"
- on "Configuration" tab, set the following 3 fields:
  - "Recipient": `your-example-app`
  - "ACS (Consumer) URL Validator*": `http://localhost:3000/login/sso/callback`
  - "ACS (Consumer) URL*": `http://localhost:3000/login/sso/callback`

## Set environment variables

- copy `.env.example` to `.env` and change the following:
  - `SSO_ENTRYPOINT`: "SSO" tab > "SAML 2.0 Endpoint (HTTP)"
  - `SSO_CERT`: "SSO" tab > "X.509 Certificate" > "View Details" > "X.509 Certificate" with "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" and newlines removed
  
Note: `SSO_ISSUER` should be "Recipient" on the "Configuration" tab and `SSO_CALLBACK_URL` should be "ACS (Consumer) URL*" on the "Configuration" tab.

**Example `.env`**

``` sh
SSO_ENTRYPOINT='https://your-domain-dev.onelogin.com/trust/saml2/http-post/sso/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

SSO_ISSUER='your-example-app'

SSO_CALLBACK_URL='http://localhost:3000/login/sso/callback'

SSO_CERT='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX='
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
- get redirected to http://localhost:3000/login/sso/callback which says "Logged in successfully"

## Links

- https://github.com/node-saml/passport-saml
- https://github.com/expressjs/session
- https://www.passportjs.org/
- https://developers.onelogin.com/
- https://medium.com/brightlab-techblog/implement-single-sign-on-saml-strategy-with-node-js-passport-js-e8b01ff79cc3

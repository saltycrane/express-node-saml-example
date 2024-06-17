import "dotenv/config";
console.log("index.ts, process.env", process.env);

import cookieSession from "cookie-session";
import express from "express";
import helmet from "helmet";
import { SAML } from "@node-saml/node-saml";

const PORT = 3000;

/**
 * node-saml
 */
const saml = new SAML({
  callbackUrl: process.env.SSO_CALLBACK_URL,
  entryPoint: process.env.SSO_ENTRYPOINT,
  idpCert: process.env.SSO_CERT,
  issuer: process.env.SSO_ISSUER,
  // wantAssertionsSigned: false, // less secure way to avoid "Invalid signature" error
  // audience: process.env.SSO_ISSUER, // the default for `audience` is the value of `issuer`. Can be set to `false` to disable audience verification.
});

/**
 * express
 */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "15mb" }));
app.use(
  cookieSession({
    name: "cooksess",
    secret: process.env.SSO_COOKIE_SESSION_SECRET,
  }),
);
app.use(helmet());

app.get("/", (req, res) => {
  console.log("index.ts, /, req.session", req.session);

  // read user from cookie-based session stored in POST /login/sso/callback
  if (req.session.user) {
    res.send(`User: <pre>${JSON.stringify(req.session.user, null, 2)}</pre>`);
  } else {
    res.send('<a href="/login/sso">Login</a>');
  }
});

// This Route Authenticates req with IDP
// If Session is active it returns saml response
// If Session is not active it redirects to IDP's login form
app.get("/login/sso", async (req, res) => {
  try {
    const host = req.headers.host;
    const RelayState = req.query.RelayState || req.body.RelayState;
    const authorizedUrl = await saml.getAuthorizeUrlAsync(RelayState, host, {});
    res.redirect(authorizedUrl);
  } catch (err) {
    res.status(500).send("Error initiating SAML login");
  }
});

// This is the callback URL
app.post("/login/sso/callback", async (req, res) => {
  try {
    const { profile } = await saml.validatePostResponseAsync(req.body);
    console.log("index.ts, /login/sso/callback, profile", profile);
    req.session.user = profile;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(401).send("Error validating SAML response");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

require("dotenv").config();
console.log(process.env);

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const passport = require("passport");
const passportSaml = require("passport-saml");

const PORT = 3000;

/**
 * passport
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// SAML strategy for passport -- Single IDP
const strategy = new passportSaml.Strategy(
  {
    entryPoint: process.env.SSO_ENTRYPOINT,
    issuer: process.env.SSO_ISSUER,
    callbackUrl: process.env.SSO_CALLBACK_URL,
    cert: process.env.SSO_CERT,
  },
  (profile, done) => done(null, profile)
);

passport.use(strategy);

/**
 * express
 */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "15mb" }));
app.use(
  // TODO: these session settings should be changed
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/login/sso">Login</a>');
});

// This Route Authenticates req with IDP
// If Session is active it returns saml response
// If Session is not active it redirects to IDP's login form
app.get(
  "/login/sso",
  passport.authenticate("saml", {
    successRedirect: "/",
    failureRedirect: "/login/sso",
  })
);

// This is the callback URL
// https://www.antoniogioia.com/saml-sso-setup-with-express-and-passport/
app.post("/login/sso/callback", (req, res) => {
  passport.authenticate("saml", (err, user, info) => {
    console.log("app.js. /login/sso/callback", { err, user, info });
    res.send(`User: <pre>${JSON.stringify(user, null, 2)}</pre>`);
  })(req, res);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

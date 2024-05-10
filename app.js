require("dotenv").config();
console.log(process.env);

const cookieSession = require("cookie-session");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const passportSaml = require("@node-saml/passport-saml");

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
    idpCert: process.env.SSO_CERT,
    // wantAssertionsSigned: false, // less secure way to avoid "Invalid signature" error
    // audience: process.env.SSO_ISSUER, // the default for `audience` is the value of `issuer`. Can be set to `false` to disable audience verification.
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
  cookieSession({
    name: "cooksess",
    secret: process.env.SSO_COOKIE_SESSION_SECRET,
  })
);
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log("app.js, /, req.session", req.session);

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
  passport.authenticate("saml", (err, user) => {
    if (err) {
      console.error("app.js, /login/sso/callback, err", err);
    }
    console.log("app.js, /login/sso/callback, user", user);

    // store user in cookie-based session
    req.session.user = user;
    res.redirect("/");
  })(req, res);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

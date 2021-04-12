const passport = require("passport");

// when user hits this route, passport takes over and handes the access code exchange
module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      // The 'google' string tells passport to use the new GoogleStrategy() we created in passport.js line 24
      scope: ["profile", "email"], // possible scopes are listed on google API
    })
  );

  //Tell passport to use google strategy to exchange auth code for access token
  app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
    res.redirect("/home"); // Redirect them to dashboard after login
  });

  // --- Logs user out -------------------------
  app.get("/api/logout", (req, res) => {
    req.logout(); // This removes the cookie that holds the user ID
    res.redirect("/");
  });

  // --- This inspects the current user ----------
  app.get("/api/current_user", (req, res) => {
    res.send(req.user); //  res.send(req.session)
    // console.log(req.user)
  });

  // --- This inspects the current user ----------
  app.get("/api/cookie", (req, res) => {
    res.send(req.session);
  });
  
};



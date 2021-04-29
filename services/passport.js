const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

// This is how you pull a schema out of mongoose. We load the schema in the models class, and pull it out here to work with it
const User = mongoose.model("users");

// ----- Define what app does when user returns from auth server w access token -------
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback", // This has to be set in the google console as a verified redirect URI
      proxy: true // need this so heroku works
    },

    // After the auth code is exchanged for the access token, the access token is sent to this function and this determines what user sees next
    async (accessToken, refreshToken, profile, done) => {

      // The google profile ID is our unique identifier for each user. Its like the password
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser); // This user is passed to serializeUser
      }

      const user = await new User({ googleId: profile.id }).save(); //If the user doensn't exist, create one
      done(null, user); // This user is passed to serializeUser. 
    }
  )
);


// --- Define how the cookie will be made ----------------
passport.serializeUser((user, done) => {
  // creates a cookie that contains the user ID
  done(null, user.id); // this is not the profileId, this is the record ID - decouples code from auth provider. If we add facebook auth then the user object won't have a googleId
});

// ------ Define how cookie will be parsed and what will be added to req object ---------------
passport.deserializeUser((id, done) => {
  // Takes the cookie that has the user ID, and uses it to find the associated user object, then attaches the user's data to the request object
  User.findById(id).then((user) => {
    done(null, user); // The user record is attached to the request object
  });
});


const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { UserModel } = require('../models/user.model.js');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/user/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user if doesn't exist
          user = await UserModel.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            phoneNumber: 0, // Google doesn't provide phone, set default
            password: 'google-oauth', // Dummy password for OAuth users
            role: 'student',
            profile: {
              profilePhoto: profile.photos[0]?.value || 'https://ik.imagekit.io/rgd5xllk8/default-avatar.png',
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
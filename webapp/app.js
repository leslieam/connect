/**
 * Main backend NodeJS file.
 *
 */
const express = require("express");
const path = require("path");
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');

const apiRoutes = require('./routes/api-routes');
const authRoutes = require('./routes/auth-routes');
const consoleRoutes = require('./routes/console-routes');

// constants
const port = process.env.PORT || 8080;

// instantiate webapp
const app = express();

// setup template engine
app.set("view engine", "ejs");

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport and cookie session
app.use(passport.initialize());
app.use(passport.session());

// body-parser middleware
app.use(bodyParser.json());

// connect to mongodb
mongoose
  .connect(keys.mongodb.dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// set up routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/console', consoleRoutes);

// create home route
app.get("/", (req, res) => {
  res.render('login');
});

// start listening on the port
app.listen(port, () => console.log(`Server is listening on ${port}`));

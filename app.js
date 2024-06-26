require("dotenv").config();
require("./db");
const express = require("express");
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(favicon(path.join(__dirname, 'favicon.ico.png')));

require("./config")(app);
const isAuthenticated = require('./middleware/jwt.middleware').isAuthenticated;

// ROUTES

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const connectRoutes = require('./routes/connect.routes');
app.use('/api', isAuthenticated, connectRoutes);

const beenRoutes = require('./routes/been.routes');
app.use('/api', isAuthenticated, beenRoutes);

const favouritesRoutes = require('./routes/favourites.routes');
app.use('/api', isAuthenticated, favouritesRoutes);

const matchRoutes = require('./routes/match.routes');
app.use('/api', isAuthenticated, matchRoutes);

const restaurantsRoutes = require('./routes/restaurants.routes');
app.use('/api', isAuthenticated, restaurantsRoutes);

const settingsRoutes = require('./routes/settings.routes');
app.use('/api', isAuthenticated, settingsRoutes);

require("./error-handling")(app);

module.exports = app;

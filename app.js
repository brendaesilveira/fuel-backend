require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const cors = require('cors');

// Enable CORS for all requests
app.use(cors());

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

const reviewRoutes = require('./routes/review.routes');
app.use('/api', isAuthenticated, reviewRoutes);

const settingsRoutes = require('./routes/settings.routes');
app.use('/api', isAuthenticated, settingsRoutes);

require("./error-handling")(app);

module.exports = app;

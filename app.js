require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

require("./config")(app);
const isAuthenticated = require('./middleware/jwt.middleware').isAuthenticated;

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const connectRoutes = require('./routes/connect.routes');
app.use('/api', connectRoutes);

const matchRoutes = require('./routes/match.routes');
app.use('/api', isAuthenticated, matchRoutes);

const navigationRoutes = require('./routes/navigation.routes');
app.use('/api', isAuthenticated, navigationRoutes);

const restaurantsRoutes = require('./routes/restaurants.routes');
app.use('/api', isAuthenticated, restaurantsRoutes);

const reviewRoutes = require('./routes/review.routes');
app.use('/api', isAuthenticated, reviewRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api', isAuthenticated, userRoutes);

require("./error-handling")(app);

module.exports = app;

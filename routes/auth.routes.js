const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

// User signup route
router.post('/signup', async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    if (email === '' || password === '' || name === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    // use regex to validate the email format
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide valid email address' });
    }

    // use regex to validate the password format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must have at least 6 characters and contain one number, one lowercase, one uppercase, and one special character.'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'The provided email is already registered' });
    }

    // Encrypt the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Generate a unique user code
    const userCode = Math.random().toString(36).substring(2, 7);

    // create the user
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      userCode
    });

    // returning the created user without sending the hashedPassword
    res.json({ email: newUser.email, name: newUser.name, userCode: newUser.userCode });
  } catch (error) {
    console.log('Error creating the user', error);
    next(error);
  }
});

// User login route
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Provided email is not registered.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      // create a payload for the JWT with the user info
      const payload = { _id: user._id, email: user.email, name: user.name };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256', // algorithm we want to encrypt the token with
        expiresIn: '6h' // time to live of the JWT
      });

      res.status(200).json({ authToken });
    } else {
      return res.status(401).json({ message: 'Unable to authenticate user' });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

// Verify token route
router.get('/verify', isAuthenticated, (req, res, next) => {
  // if the jwt is valid, the payload gets decoded by the middleware
  // and is made available in req.payload
  console.log('req.payload', req.payload);

  // send it back with the user data from the token
  res.json(req.payload);
});

// Connect users route
router.post('/connect', async (req, res, next) => {
  const { userCode, friendCode } = req.body;

  try {
    // Find the user and friend
    const user = await User.findOne({ userCode });
    const friend = await User.findOne({ userCode: friendCode });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if they are already connected
    if (user.connections.includes(friendCode) || friend.connections.includes(userCode)) {
      return res.status(400).json({ message: 'Users are already connected' });
    }

    // Updating connections array
    user.connections.push(friendCode);
    friend.connections.push(userCode);

    await user.save();
    await friend.save();

    res.json({ message: 'Users connected successfully' });
  } catch (error) {
    console.error('Error connecting users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/disconnect', async (req, res, next) => {
  const { userCode, friendCode } = req.body;

  try {
    // Find the user and friend
    const user = await User.findOne({ userCode });
    const friend = await User.findOne({ userCode: friendCode });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if connection exists
    if (!user.connections.includes(friendCode) || !friend.connections.includes(userCode)) {
      return res.status(400).json({ message: 'Connection not found' });
    }

    // Remove connection
    await User.updateOne({ userCode }, { $pull: { connections: friendCode } });
    await User.updateOne({ userCode: friendCode }, { $pull: { connections: userCode } });

    res.json({ message: 'Users disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;

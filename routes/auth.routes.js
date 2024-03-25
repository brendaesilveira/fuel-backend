const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

// User signup route
router.post('/signup', async (req, res, next) => {
  const { email, password, name, location } = req.body;

  try {
    if (email === '' || password === '' || name === '') {
      return res.status(400).json({ message: 'Please fill out all fields to proceed.' });
    }

    // use regex to validate the email format
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide valid email address' });
    }

    // use regex to validate the password format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Please update your password to meet all requirements.'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'This email is already registered. Please use a different email or try logging in' });
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
      location,
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
      return res.status(400).json({ message: 'Please enter your email and password to proceed.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'This email is not registered yet. Please create an account.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      // create a payload for the JWT with the user info
      const payload = { _id: user._id, email: user.email, name: user.name, setupCompleted: user.setupCompleted};

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256', // algorithm we want to encrypt the token with
        expiresIn: '6h' // time to live of the JWT
      });

      res.status(200).json({ authToken });
    } else {
      return res.status(401).json({ message: 'Incorrect password. Please double-check and try again.' });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

// Verify token route
router.get('/verify', isAuthenticated, async (req, res, next) => {
  // if the jwt is valid, the payload gets decoded by the middleware
  // and is made available in req.payload
  console.log('req.payload', req.payload);
  const user = await User.findById(req.payload._id,  {password: 0})
  // send it back with the user data from the token
  res.json(user);
});

// Initial setup
router.post('/setup', async (req, res, next) => {
  const { location, imgUrl, _id } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, {
      location,
      profilePicture: imgUrl,
      setupCompleted: true
    },
    {new: true});

    console.log('Updated user', updatedUser);
    res.status(201).json(updatedUser);
  } catch (error) {
    console.log('An error occurred updating the user', error);
    next(error);
  }
});

module.exports = router;
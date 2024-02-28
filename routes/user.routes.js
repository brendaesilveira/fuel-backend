const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model')
const mongoose = require('mongoose');


/* File to handle user activities - likes, favourites, been and settings */

/* LIKES */

// Handle user likes
router.post('/likes', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if restaurant is already liked
    if (user.likes.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant was already liked' });
    }

    // Add the restaurant to the user's likes array
    user.likes.push(restaurantId);
    await user.save();

    return res.status(200).json({ message: 'Restaurant liked successfully' });
  } catch (error) {
    console.error('Error liking restaurant:', error);
    next(error);
  }
})

// Get all user likes
  router.get('/likes', async (req, res, next) => {
  try {
    const { userCode } = req.query; // => http://localhost:5005/api/likes?userCode=${userCode}

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ likes: user.likes });
  } catch (error) {
    console.error('Error fetching user likes:', error);
    next(error);
  }
});

// Remove a like
  router.delete('/likes', async (req, res, next) => {
  try {
      const { userCode, restaurantId } = req.body;

      // Find the user
      const user = await User.findOne({ userCode });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if restaurant is already liked
      if (!user.likes.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant not found on likes' });
      }

      // Remove the restaurant from the user's likes array
      user.likes = user.likes.filter(id => id !== restaurantId);
      await user.save();

      return res.status(200).json({ message: 'Restaurant unliked successfully' });
  } catch (error) {
      console.error('Error unliking restaurant:', error);
      next(error);
  }
});

/* FAVOURITES */

// Handle user favourites
router.post('/favourites', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });
    console.log(userCode)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if restaurant is already on favourites
    if (user.favourites.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant was already on favourites' });
    }

    // Add the restaurant to the user's favourites array
    user.favourites.push(restaurantId);
    await user.save();

    return res.status(200).json({ message: 'Restaurant added to favourites successfully' });
  } catch (error) {
    console.error('Error adding restaurant to favourites:', error);
    next(error);
  }
})

// Get all user favourites
router.get('/favourites', async (req, res, next) => {
  try {
    const { userCode } = req.query; // => http://localhost:5005/api/favourites?userCode=${userCode}

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.error('Error fetching user favourites:', error);
    next(error);
  }
});

// Remove a favourite
  router.delete('/favourites', async (req, res, next) => {
  try {
      const { userCode, restaurantId } = req.body;

      // Find the user
      const user = await User.findOne({ userCode });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if restaurant is already liked
      if (!user.favourites.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant not found on favourites' });
      }

      // Remove the restaurant from the user's likes array
      user.favourites = user.favourites.filter(id => id !== restaurantId);
      await user.save();

      return res.status(200).json({ message: 'Restaurant removed from favourites successfully' });
  } catch (error) {
      console.error('Error removing restaurant from favourites:', error);
      next(error);
  }
});

/* BEEN */

// Handle restaurants which user has already been
router.post('/been', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if restaurant is already on been
    if (user.been.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant was already on been' });
    }

    // Add the restaurant to the user's been array
    user.been.push(restaurantId);
    await user.save();

    return res.status(200).json({ message: 'Restaurant added to been successfully' });
  } catch (error) {
    console.error('Error adding restaurant to favourites:', error);
    next(error);
  }
})

// Get all user's been
router.get('/been', async (req, res, next) => {
  try {
    const { userCode } = req.query; // => http://localhost:5005/api/been?userCode=${userCode}

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ been: user.been });
  } catch (error) {
    console.error('Error fetching user been:', error);
    next(error);
  }
});

// Remove a favourite
  router.delete('/been', async (req, res, next) => {
  try {
      const { userCode, restaurantId } = req.body;

      // Find the user
      const user = await User.findOne({ userCode });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if restaurant is already liked
      if (!user.been.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant not found on been' });
      }

      // Remove the restaurant from the user's been array
      user.been = user.favourites.filter(id => id !== restaurantId);
      await user.save();

      return res.status(200).json({ message: 'Restaurant removed from been successfully' });
  } catch (error) {
      console.error('Error removing restaurant from been:', error);
      next(error);
  }
});

module.exports = router;


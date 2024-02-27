const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model')
const mongoose = require('mongoose');


/* File to handle user activities - likes, favourites, been and settings */

// Uploading profile picture
// Handle user likes
router.post('/likes', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
    const { userCode } = req.query;

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

      // Remove the restaurant from the user's likes array
      user.likes = user.likes.filter(id => id !== restaurantId);
      await user.save();

      return res.status(200).json({ message: 'Restaurant unliked successfully' });
  } catch (error) {
      console.error('Error unliking restaurant:', error);
      next(error);
  }
});

module.exports = router;


const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const User = require('../models/User.model')
const Match = require('../models/Match.model');

// File to handle likes and matches

/* ---------------------------------------- POST ---------------------------------------- */

// Handle user likes
router.post('/likes', async (req, res, next) => {
  try {
    const { userCode, friendCode, restaurantId } = req.body;

    // Check if everything is provided
    if (!userCode || !friendCode || !restaurantId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Find the user
    const user = await User.findOne({ userCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    console.log(user)
    // Check if restaurant is already liked
    if (user.likes.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant was already liked' });
    }

    // Find the friend
    const friend = await User.findOne({ userCode: friendCode });
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Check if the friend has already liked the same restaurant
    if (friend.likes.includes(restaurantId)) {
      // Check if a match document already exists
      let match = await Match.findOne({
        users: { $all: [user._id, friend._id] }
      });

      if (!match) {
        // If match document doesn't exist, create one
        match = new Match({
          users: [user._id, friend._id],
          restaurants: [restaurantId]
        });
      } else {
        // If it already exists, add the restaurant to it
        match.restaurants.push(restaurantId);
      }

      // Add the restaurant to user likes array
      user.likes.push(restaurantId);

      // Save
      await Promise.all([user.save(), friend.save(), match.save()]);

      return res.status(200).json({ message: 'Restaurant liked and match created successfully' });
    }

    // If friend hasn't liked the restaurant, just add it to user's likes array
    user.likes.push(restaurantId);
    await user.save();

    return res.status(200).json({ message: 'Restaurant liked successfully' });

  } catch (error) {
    console.error('Error liking restaurant:', error);
    next(error);
  }
});

/* ---------------------------------------- DELETE ---------------------------------------- */

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

  // Find the index of the restaurantId in the likes array
  const index = user.likes.indexOf(restaurantId);

  // Remove the restaurant from the user's likes array
  if (index !== -1) {
    user.likes.splice(index, 1);
  }

    // Find and update the match document
    await Match.updateOne(
      {
        users: user._id,
        restaurants: restaurantId
      },
      {
        // Remove the restaurant from the match
        $pull: { restaurants: restaurantId }
      }
    );

    // Save user changes
    await user.save();

    return res.status(200).json({ message: 'Restaurant removed from likes successfully' });
  } catch (error) {
    console.error('Error unliking restaurant:', error);
    next(error);
  }
});

/* ---------------------------------------- GET ---------------------------------------- */

// Get all user LIKES
router.get('/likes', async (req, res, next) => {
  try {
    const { userCode } = req.query // => http://localhost:5005/api/likes?userCode=${userCode}

    // Find the user and populate likes array with restaurant objects
    const user = await User.findOne({ userCode }).populate('likes')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const likedRestaurants = user.likes.map(like => like.toObject())

    return res.status(200).json({ likes: likedRestaurants })
  } catch (error) {
    console.error('Error fetching user likes:', error)
    next(error);
  }
});

// Get all MATCHES
router.get('/match', async (req, res, next) => {
  try {
    const { userCode, friendCode } = req.query // -> http://localhost:5005/api/match?userCode=4o0z8&friendCode=o7uh4

    // Find the user
    const user = await User.findOne({ userCode })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the friend
    const friend = await User.findOne({ userCode: friendCode });
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Check if they are connected
    if (user.connections.includes(friend.userCode) || friend.connections.includes(user.userCode)) {
      // If so, find if they have a match and populate the user and restaurants fields
      const match = await Match.findOne({
        users: { $all: [user._id, friend._id] }
      }).populate('restaurants');

      if (match) {
        return res.status(200).json({ match });
      } else {
        return res.status(404).json({ message: 'No matches found for the user and friend' });
      }
    }
  } catch (error) {
    console.error('Error fetching user likes:', error);
    next(error);
  }
});

module.exports = router;
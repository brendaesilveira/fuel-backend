const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const User = require('../models/User.model')
const Match = require('../models/Match.model');

// File to handle likes and matches

/* ---------------------------------------- POST ---------------------------------------- */

// Handle user likes
router.post('/likes', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the restaurant using the restaurantId from the external API
    const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if restaurant is already liked
    if (user.likes.includes(restaurant._id)) {
      return res.status(400).json({ message: 'Restaurant was already liked' });
    }

    // If friendCode is provided, check if the friend has liked the same restaurant
    const userCodes = user.connections.map(connection => connection.userCode);
    const friend = await User.findOne({ userCode: { $in: userCodes } });

    if (friend) {
      if (friend.likes.includes(restaurant._id)) {
        // Check if a match document already exists
        let match = await Match.findOne({
          users: { $all: [user._id, friend._id] }
        });

        if (!match) {
          // If match document doesn't exist, create one
          match = new Match({
            users: [user._id, friend._id],
            restaurants: [restaurant._id]
          });
        } else {
          // If it already exists, add the restaurant to it
          match.restaurants.push(restaurant._id);
        }
        await Promise.all([friend.save(), match.save()]);
      }

      // Add the restaurant to user likes array
      user.likes.push(restaurant._id);

      // Save
      await user.save();

      return res.status(200).json({ message: 'Restaurant liked and match created successfully' });
    }

    // If friendCode is not provided or friend has not liked the restaurant, just add it to user's likes array
    user.likes.push(restaurant._id);
    await user.save();

    return res.status(200).json({ message: 'Restaurant liked successfully' });
  } catch (error) {
    console.error('Error liking restaurant:', error);
    next(error);
  }
});


// Handle user discards
router.post('/discards', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove restaurant from user's list of available restaurants
    user.discardedRestaurants.push(restaurantId);
    await user.save();

    return res.status(200).json({ message: 'Restaurant discarded successfully' });
  } catch (error) {
    console.error('Error discarding restaurant:', error);
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
    const { userCode } = req.query;

    // Find the user and populate likes array with restaurant objects
    const user = await User.findOne({ userCode }).populate('likes');
    console.log(user.likes)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const likedRestaurants = user.likes.map(like => like.toObject());

    // Get IDs of liked restaurants
    const likedRestaurantIds = user.likes.map(like => like.restaurantId);

    return res.status(200).json({ likes: likedRestaurants, likedRestaurantIds });
  } catch (error) {
    console.error('Error fetching user likes:', error);
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
    if (user.connections.find(friend => friend.userCode === friend.userCode) || friend.connections.find(friend => friend.userCode === user.userCode)) {
      // If so, find if they have a match and populate the user and restaurants fields
      const match = await Match.findOne({
        users: { $all: [user._id, friend._id] }
      }).populate('restaurants');

      if (match) {
        return res.status(200).json({match});
      } else {
        return res.status(404).json({ message: 'No matches found for the user and friend' });
      }
    } else {

    }
    return res.json({message: 'something'})
  } catch (error) {
    console.error('Error fetching user likes:', error);
    next(error);
  }
});

// Get all DISCARDS
router.get('/discards', async (req, res, next) => {
  try {
    const { userCode } = req.query;

    const user = await User.findOne({ userCode }).populate('discardedRestaurants')
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const discardedRestaurantIds = user.discardedRestaurants.map(discard => discard.restaurantId);

    return res.status(200).json({ discardedRestaurantIds });
  } catch (error) {
    console.error('Error getting discarded restaurants:', error);
    next(error);
  }
});


module.exports = router;
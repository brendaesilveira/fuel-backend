const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const User = require('../models/User.model')

/* ---------------------------------------- POST ---------------------------------------- */

// Handle restaurants that user has been to
router.post('/been', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

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

    // Check if restaurant is already on been
    if (user.been.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant is already marked as been' });
    } else {
        user.been.push(restaurantId)
    }

    await user.save();

      return res.status(200).json({ message: 'Restaurant marked as been successfully' })
  } catch (error) {
    console.error('Error liking restaurant:', error);
    next(error);
  }
});

/* ---------------------------------------- DELETE ---------------------------------------- */

// Remove a been
router.delete('/been', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  // Check if restaurant is on been
  if (!user.been.includes(restaurantId)) {
    return res.status(400).json({ message: 'Restaurant not found on been' });
  }

  // Find the index of the restaurantId in the been array
  const index = user.been.indexOf(restaurantId);

  // Remove the restaurant from the user's been array
  if (index !== -1) {
    user.been.splice(index, 1);
  }
    await user.save();

    return res.status(200).json({ message: 'Restaurant removed from been successfully' });
  } catch (error) {
    console.error('Error removing restaurant from been:', error);
    next(error);
  }
});

/* ---------------------------------------- GET ---------------------------------------- */

// Get all been
router.get('/been', async (req, res, next) => {
  try {
    const { userCode } = req.query // => http://localhost:5005/api/been?userCode=${userCode}

    // Find the user and populate been array with restaurant objects
    const user = await User.findOne({ userCode }).populate('been')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const beenRestaurants = user.been.map(been => been.toObject())

    return res.status(200).json({ been: beenRestaurants })
  } catch (error) {
    console.error('Error fetching user been:', error)
    next(error);
  }
});

module.exports = router;
const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const User = require('../models/User.model')

/* ---------------------------------------- POST ---------------------------------------- */

// Handle favourites
router.post('/favourites', async (req, res, next) => {
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

    // Check if restaurant is already on favourites
    if (user.favourites.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant is already marked as favourite' });
    } else {
        user.favourites.push(restaurantId)
    }

    await user.save();

      return res.status(200).json({ message: 'Restaurant added to favourites successfully' })
  } catch (error) {
    console.error('Error liking restaurant:', error);
    next(error);
  }
});

/* ---------------------------------------- DELETE ---------------------------------------- */

// Remove a favourite
router.delete('/favourites', async (req, res, next) => {
  try {
    const { userCode, restaurantId } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  // Check if restaurant is on favourites
  if (!user.favourites.includes(restaurantId)) {
    return res.status(400).json({ message: 'Restaurant not found on favourites' });
  }

  // Find the index of the restaurantId in the favourites array
  const index = user.favourites.indexOf(restaurantId);

  // Remove the restaurant from the user's favourites array
  if (index !== -1) {
    user.favourites.splice(index, 1);
  }
    await user.save();

    return res.status(200).json({ message: 'Restaurant removed from favourites successfully' });
  } catch (error) {
    console.error('Error removing restaurant from favourites:', error);
    next(error);
  }
});

/* ---------------------------------------- GET ---------------------------------------- */

// Get all favourites
router.get('/favourites', async (req, res, next) => {
  try {
    const { userCode } = req.query // => http://localhost:5005/api/favourites?userCode=${userCode}

    // Find the user and populate favourites array with restaurant objects
    const user = await User.findOne({ userCode }).populate('favourites')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const favouriteRestaurants = user.favourites.map(favourites => favourites.toObject())

    return res.status(200).json({ favourites: favouriteRestaurants })
  } catch (error) {
    console.error('Error fetching user favourites:', error)
    next(error);
  }
});

module.exports = router;


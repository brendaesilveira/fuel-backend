const router = require('express').Router();
const Match = require('../models/Match.model');
const User = require('../models/User.model');

// Create a new match between connected users
router.post('/likes', async (req, res, next) => {
  try {
    const { userCode, friendCode, restaurantId } = req.body;

    // Find user and friend
    const user = await User.findOne({ userCode });
    const friend = await User.findOne({ userCode: friendCode });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if connection exists
    if (!user.connections.includes(friendCode) || !friend.connections.includes(userCode)) {
    return res.status(400).json({ message: 'Connection not found' });
   }
   console.log(restaurantId)

    // Create the match
   const likedId = user.likes.find((id) => id === restaurantId)

    if (user.likedId === friend.likedId) {
    return res.status(201).json({ message: 'Its a match' });
   }

  } catch (error) {
    console.error('Error creating match:', error);
    next(error);
  }
});

// Get all matches
router.get('/match', async (req, res, next) => {
  console.log(req.headers);
  try {
    const allMatches = await Match.find().populate('restaurants');

    res.json(allMatches);
  } catch (error) {
    console.log('An error occurred getting all matches', error);
    next(error);
  }
});

module.exports = router;

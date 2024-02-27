const router = require('express').Router();
const Match = require('../models/Match.model');
const User = require('../models/User.model');

// Handle matches
router.post('/matches', async (req, res, next) => {
  try {
    const { userCode, friendCode } = req.body;

    // Find the users
    const user = await User.findOne({ userCode });
    const friend = await User.findOne({ userCode: friendCode });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Find the common liked restaurants
    const commonLikes = user.likes.filter(restaurantId => friend.likes.includes(restaurantId));

    // Create a new Match instance with populated users and restaurants arrays
    const match = new Match({
      users: [user._id, friend._id], // Populate with user IDs
      restaurants: commonLikes
    });

    // Save the match
    await match.save();

    return res.status(200).json({ message: 'Matches created successfully' });
  } catch (error) {
    console.error('Error creating matches:', error);
    next(error);
  }
})


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

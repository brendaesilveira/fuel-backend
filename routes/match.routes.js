const router = require('express').Router();
const Match = require('../models/Match.model');

// Get matches for a user
router.get('/:userId/matches', async (req, res, next) => {
  try {
    const matches = await Match.find({ users: req.params.userId });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    next(error);
  }
});

// Create a new match between users
router.post('/create', async (req, res, next) => {
  try {
    // Logic to create a new match between users
    res.json({ message: 'Match created successfully' });
  } catch (error) {
    console.error('Error creating match:', error);
    next(error);
  }
});

module.exports = router;

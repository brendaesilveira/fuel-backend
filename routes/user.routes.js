const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const fileUploader = require('../config/cloudinary.config');

// Get restaurant by ID
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    next(error);
  }
});

// Like a restaurant
router.post('/:id/like', async (req, res, next) => {
  try {
    // Logic to handle liking a restaurant
    res.json({ message: 'Restaurant liked successfully' });
  } catch (error) {
    console.error('Error liking restaurant:', error);
    next(error);
  }
});

// Add restaurant to favorites
router.post('/:id/favorite', async (req, res, next) => {
  try {
    // Logic to handle adding a restaurant to favorites
    res.json({ message: 'Restaurant added to favorites' });
  } catch (error) {
    console.error('Error adding restaurant to favorites:', error);
    next(error);
  }
});

// Mark restaurant as been
router.post('/:id/been', async (req, res, next) => {
  try {
    // Logic to handle marking a restaurant as been
    res.json({ message: 'Restaurant marked as been' });
  } catch (error) {
    console.error('Error marking restaurant as been:', error);
    next(error);
  }
});

// POST route for uploading profile picture
router.post('/upload', fileUploader.single('file'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).json({ message: 'Profile picture uploaded successfully', imgUrl: req.file.path });
  } catch (error) {
    console.log('An error occurred uploading the profile picture:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Review = require('../models/Review.model');

// File to reviews for restaurants the user marked as been

/* ---------------------------------------- POST ---------------------------------------- */

// Create a review
router.post('/review', async (req, res) => {
  try {
    const { userCode, restaurantId, rating, comment } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the restaurant is in the user's "been" list
    const isRestaurantMarkedAsBeen = user.been.includes(restaurantId);
    if (!isRestaurantMarkedAsBeen) {
      return res.status(400).json({ message: 'You can only review restaurants you have marked as "been"' });
    }

    // Create a new review
    const review = new Review({ user: user._id, restaurant: restaurantId, rating, comment });
    await review.save();

    // Push the review's _id to the user's reviews array
    user.reviews.push(review._id);
    await user.save();

    res.status(201).json({ message: 'Review created successfully'});
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/* ---------------------------------------- PUT ---------------------------------------- */

// Update a review
router.put('/review/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/* ---------------------------------------- DELETE ---------------------------------------- */

// Delete a review
router.delete('/review/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userCode } = req.body;

    // Find the user
    const user = await User.findOne({ userCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the reviewId in the user's reviews array
    const index = user.reviews.indexOf(reviewId);

    // Remove the review from the user's reviews array
    if (index !== -1) {
      user.reviews.splice(index, 1);
    }

    await user.save();

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;

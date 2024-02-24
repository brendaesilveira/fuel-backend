const router = require('express').Router();

// Redirect to user profile
router.get('/profile', (req, res) => {
  res.redirect(`/users/${req.user.id}/profile`);
});

// Redirect to user's "Been" tab
router.get('/profile/been', (req, res) => {
  res.redirect(`/users/${req.user.id}/profile/been`);
});

// Redirect to user's "Saved" tab
router.get('/profile/saved', (req, res) => {
  res.redirect(`/users/${req.user.id}/profile/saved`);
});

// Redirect to user's "Liked" tab
router.get('/profile/liked', (req, res) => {
  res.redirect(`/users/${req.user.id}/profile/liked`);
});

module.exports = router;

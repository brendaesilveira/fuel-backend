const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const User = require('../models/User.model')
const Match = require('../models/Match.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config')
const bcrypt = require('bcryptjs');

/* ---------------------------------------- PROFILE IMAGE ---------------------------------------- */

// Handle image UPLOAD
router.post('/settings/upload', fileUploader.single('file'), async (req, res) => {
  try {
    res.status(200).json({imgUrl: req.file.path})
  } catch (error) {
    console.log('An eror occured uploading the image', error)
    res.status(500).json({message: 'An error occured'})
  }
})

// Handle image DELETE
router.delete('/settings/upload', async (req, res) => {
    try {
        const { userCode } = req.body;

        // Find the user
        const user = await User.findOne({ userCode });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user's profile picture
        user.profilePicture = null;
        await user.save();

        res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
        console.error('An error occurred deleting the image', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

/* ---------------------------------------- LOCATION ---------------------------------------- */

// Handle location update
router.put('/settings/location', async (req, res, next) => {
    try {
      const { userCode, newLocation } = req.body;

      if (!newLocation || !newLocation.country || !newLocation.city) {
        return res.status(400).json({ message: 'New location information is missing' });
      }

      // Find the user
      const user = await User.findOne({ userCode });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { location: newLocation },
        { new: true }
      );

       // Check if setup is completed
       if (!user.setupCompleted) {
        user.setupCompleted = true;
    }

      // Iterate over user connections and disconnect any users who are not in the same location
      const disconnectedUsers = []

      for (const connectionUserCode of user.connections) {
        const connectionUser = await User.findOne({ userCode: connectionUserCode });
        if (connectionUser.location.country !== newLocation.country ||
            connectionUser.location.city !== newLocation.city) {

          // Remove the connection from the user's connections array
          user.connections.pull(connectionUserCode);

          // Remove the connection from connectionUser's connections array
          connectionUser.connections.pull(userCode);
          await connectionUser.save();
          disconnectedUsers.push(connectionUser);

          // Clear matches between the undone connections
          await Match.findOneAndDelete({
            users: { $all: [user._id, connectionUser._id] }
          });
        }
      }

      await user.save();

      return res.status(200).json({ message: 'Location updated successfully', disconnectedUsers });
    } catch (error) {
      console.error('Error updating location:', error);
      next(error);
    }
  });

  /* ---------------------------------------- CREDENTIALS ---------------------------------------- */

  // Handle NAME update
router.put('/settings/name', async (req, res, next) => {
    const { userCode, newName } = req.body;

    try {

      // Find the user
      const user = await User.findOne({ userCode });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

        user.name = newName;
        await user.save();

        res.json({ message: 'Name updated successfully' });
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change Email
router.put('/settings/email', async (req, res, next) => {
    const { userCode, newEmail } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ userCode });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate the new email format
        const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Provide a valid email address' });
        }

        // Check if the new email is already in use by another user
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser && existingUser.userCode !== userCode) {
            return res.status(400).json({ message: 'This email is already being used by another user' });
        }

        // Update the user's email
        user.email = newEmail;
        await user.save();

        res.json({ message: 'Email updated successfully' });
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Change Password
router.put('/settings/password', async (req, res, next) => {
    const { userCode, currentPassword, newPassword } = req.body;

    try {

      // Find the user
      const user = await User.findOne({ userCode });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

        // Check if current password matches
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // use regex to validate the password format
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
        if (!passwordRegex.test(newPassword)) {
         return res.status(400).json({
        message: 'Password must have at least 6 characters and contain one number, one lowercase, one uppercase, and one special character.'
      });
    }

        // Encrypt the new password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/* ---------------------------------------- DELETE ACCOUNT ---------------------------------------- */

// Handle user account deletion
router.delete('/settings/delete/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Id is not valid' });
      }

      // Find the user and delete
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete any matches the user may have
      await Match.deleteMany({ users: id });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;

const router = require('express').Router();
const Restaurant = require('../models/Restaurant.model');
const User = require('../models/User.model')
const Match = require('../models/Match.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config')

/* ---------------------------------------- PROFILE IMAGE ---------------------------------------- */

// Handle image UPLOAD
router.post('/settings/upload', fileUploader.single('file'), async (req, res) => {
    try {
        const { userCode } = req.body;

        // Find the user
        const user = await User.findOne({ userCode });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile picture
        user.profilePicture = req.file.path;
        await user.save();

        res.status(200).json({ message: 'Profile picture uploaded successfully', imgUrl: req.file.path });
    } catch (error) {
        console.error('An error occurred uploading the image', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Handle image UPDATE
router.put('/settings/upload', fileUploader.single('file'), async (req, res) => {
    try {
        const { userCode } = req.body;

        // Find the user
        const user = await User.findOne({ userCode });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile picture
        user.profilePicture = req.file.path;
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully', imgUrl: req.file.path });
    } catch (error) {
        console.error('An error occurred updating the image', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

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


module.exports = router;
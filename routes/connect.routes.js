const router = require('express').Router();
const User = require('../models/User.model');

// Routes to connect users

/* ---------------------------------------- CONNECTING ---------------------------------------- */
router.post('/connect', async (req, res, next) => {
  const { userCode, friendCode } = req.body;

  try {
      // Find the user and friend
      const user = await User.findOne({ userCode });
      const friend = await User.findOne({ userCode: friendCode });

      if (!user || !friend) {
          return res.status(404).json({ message: 'User or friend not found' });
      }

      // Check if they are already connected
      if (user.connections.includes(friendCode) || friend.connections.includes(userCode)) {
          return res.status(400).json({ message: 'Users are already connected' });
      }

      // Check if they are in the same location
      if (user.location.country !== friend.location.country || user.location.city !== friend.location.city) {
          return res.status(400).json({ message: 'Users must be in the same location to connect' });
      } else {
          // If so, connect them
          user.connections.push({ userCode: friendCode, userName: friend.name });
          friend.connections.push({ userCode, userName: user.name });

          await user.save();
          await friend.save();
      }

      res.json({ message: 'Users connected successfully' });
  } catch (error) {
      console.error('Error connecting users:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


/* ---------------------------------------- DISCONNECTING ---------------------------------------- */
  router.post('/disconnect', async (req, res, next) => {
    const { userCode, friendCode } = req.body;

    try {
      // Find the user and friend
      const user = await User.findOne({ userCode });
      const friend = await User.findOne({ userCode: friendCode });

      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }

      // Check if connection exists
      if (!user.connections.includes(friendCode) || !friend.connections.includes(userCode)) {
        return res.status(400).json({ message: 'Connection not found' });
      }

     // Remove connection
      await User.updateOne({ userCode }, { $pull: { connections: friendCode } });
      await User.updateOne({ userCode: friendCode }, { $pull: { connections: userCode } });

      res.json({ message: 'Users disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;
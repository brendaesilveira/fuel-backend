const { Schema, model } = require('mongoose');

const userActivitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityType: {
      type: String,
      required: true
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant'
    }
  },
  {
    timestamps: true
  }
);

const UserActivity = model('UserActivity', userActivitySchema);

module.exports = UserActivity;

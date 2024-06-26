const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    preferences: {
      cuisines: [{ type: String }],
      foodTypes: [{ type: String }],
      diningStyles: [{ type: String }]
    },
    location: {
      country: { type: String },
      city: { type: String }
    },
    profilePicture: { type: String },
    userCode: {
      type: String,
      unique: true
    },
    connections: [{
      userCode: { type: String },
      userName: { type: String }
    }],
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    }],
    been: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    }],
    favourites: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    }],
    setupCompleted: {
      type: Boolean,
      default: false
    },
    discardedRestaurants: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    }]
  },
  {
    timestamps: true
  }
);

const User = model('User', userSchema);

module.exports = User;

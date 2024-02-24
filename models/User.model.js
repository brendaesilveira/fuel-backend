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
    }
  },
  {
    timestamps: true
  }
);

// Method to add preferences
userSchema.methods.addPreferences = function(cuisines, foodTypes, diningStyles) {
  this.preferences.cuisines = cuisines;
  this.preferences.foodTypes = foodTypes;
  this.preferences.diningStyles = diningStyles;
  return this.save();
};

const User = model('User', userSchema);

module.exports = User;

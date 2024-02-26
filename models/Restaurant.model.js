const { Schema, model } = require('mongoose');

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
    },
    location: {
      address1: String,
      address2: String,
      address3: String,
      city: String,
      state: String,
      zip_code: String,
      country: String
    },
    image_url: {
      type: String
    },
    rating: {
      type: Number,
    },
    price: {
      type: String
    },
    categories: [
      {
        alias: String,
        title: String
      }
    ],
    restaurantId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Restaurant', restaurantSchema);

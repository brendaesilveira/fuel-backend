const router = require('express').Router();
const axios = require('axios');
const Restaurant = require('../models/Restaurant.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.get('/restaurants', isAuthenticated, async (req, res, next) => {
  try {
    const { location, categories } = req.query;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}$limit=20&offset=40`;
    const apiKey = process.env.YELP_API_KEY;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    // https://api.yelp.com/v3/businesses/search?location=LISBON&categories=restaurants
    console.log(response.data)

    const restaurants = response.data.businesses.map(business => ({
      name: business.name,
      image_url: business.image_url,
      rating: business.rating,
      price: business.price,
      location: business.location,
      categories: business.categories,
      restaurantId: business.id
    }));

    await Restaurant.insertMany(restaurants);

    res.json(restaurants);
  } catch (error) {
    console.error('An error occurred getting all restaurants:', error);
    console.error('Response data:', error.response ? error.response.data : 'No response data');
    next(error);
  }
});

module.exports = router;

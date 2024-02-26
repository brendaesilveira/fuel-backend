const router = require('express').Router();
const axios = require('axios');
const Restaurant = require('../models/Restaurant.model');

// Route to get restaurants

router.get('/restaurants', async (req, res, next) => {
  console.log(req.headers);
  try {
    const { location } = req.query;
    const apiKey = process.env.YELP_API_KEY;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?location=${location}categories=restaurants&limit=1`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    const allRestaurants = await Restaurant.find()

    res.json(allRestaurants);
  } catch (error) {
    console.log('An error occurred getting all restaurants', error);
    next(error);
  }
});

router.get('/restaurants', async (req, res, next) => {
  try {

    const restaurants = response.data.restaurants.map(restaurant => ({
      id: business.id,
      name: business.name,
      image_url: business.image_url,
      rating: business.rating,
      price: business.price,
      location: business.location,
      categories: business.categories
    }));

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    next(error);
  }
});

module.exports = router;

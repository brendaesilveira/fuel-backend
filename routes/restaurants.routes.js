const router = require('express').Router();
const axios = require('axios');
const Restaurant = require('../models/Restaurant.model');

router.get('/restaurants/:locationRest', async (req, res, next) => {
  const { locationRest } = req.params;
  const page = parseInt(req.query.page) || 1; // Get the page parameter or default to 1

  try {
    const perPage = 10; // Number of restaurants per page
    const skip = (page - 1) * perPage; // Calculate the number of restaurants to skip
    const allRestaurants = await Restaurant.find({ 'location.city': locationRest }).skip(skip).limit(perPage);
    const totalCount = await Restaurant.countDocuments({ 'location.city': locationRest });

    res.status(200).json({ restaurants: allRestaurants, totalCount });
  } catch (error) {
    console.error('An error occurred getting all restaurants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/restaurants', async (req, res, next) => {
  try {
    const { location, category } = req.body;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${category}$limit=20&offset=40`;
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

const router = require('express').Router();
const axios = require('axios');

// Route to fetch basic business details for specific categories
router.get('/restaurants', async (req, res, next) => {
  try {
    const { category } = req.query;
    const apiKey = process.env.YELP_API_KEY;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?categories=${category}&limit=50`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const businesses = response.data.businesses.map(business => ({
      id: business.id,
      name: business.name,
      image_url: business.image_url,
      rating: business.rating,
      price: business.price,
      location: business.location,
      categories: business.categories
    }));

    res.json(businesses);
  } catch (error) {
    console.error('Error fetching business details:', error);
    next(error);
  }
});

module.exports = router;

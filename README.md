# Fuel Management Server

## Routes

### Auth Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /auth/signup | Creates a new user |
| POST   | /auth/login  | Logs the user      |
| GET    | /auth/verify | Verifies the JWT   |
| POST   | /auth/setup  | Creates user setup |

### Been Routes

| Method | Route      | Description        |
| ------ | ---------- | ------------------ |
| POST    | /been | Add restaurant to been   |
| DELETE    | /been  | Removes a restaurant from been   |
| GET    | /been | Gets all restaurants marked as been  |

### Connect Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST    | /connect | Connects user to friend   |
| POST   | /disconnect | Undo users connection   |

### Favourites Routes

| Method | Route      | Description        |
| ------ | ---------- | ------------------ |
| POST    | /favourites | Add restaurant to favourites  |
| DELETE    | /favourites  | Removes a restaurant from favourites   |
| GET    | /favourites | Gets all restaurants favourites  |

### Review Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /review/:restaurantId/reviews | Adds a review for a restaurant   |
| PUT    | /review/:restaurantId/reviews/:reviewId | Updates a review  |
| DELETE | /review/:restaurantId/reviews/:reviewId | Deletes a revieW  |

### Match Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /likes | Likes a restaurant and creates a match   |
| POST   | /discards | Discards a restaurant  |
| DELETE   | /likes | Dislikes a restaurant   |
| GET   | /likes | Gets all likes   |
| GET   | /match | Gets all matches   |
| GET   | /discards | Gets all discards   |

### Restaurant Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| GET   | /restaurants/:locationRest | Retrieves restaurants by location   |
| GET   | /restaurants | Searches restaurants using the Yelp API  |

### Settings Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST	   | /settings/upload	 | Handles image upload for user profile   |
| GET   | /settings/upload	 | Deletes user profile picture  |
| PUT   | /settings/location	 | Updates user location  |
| PUT   | /settings/name	 | Updates user name  |
| PUT   | /settings/email	 | Updates user email  |
| PUT   | /settings/password	 | Updates user password  |
| DELETE  | /settings/delete/:id	 | Deletes user account  |

## Models

### User Model

```js
{
  email: String,
  password: String,
  name: String,
  preferences: {
      cuisines: [{ type: String }],
      foodTypes: [{ type: String }],
      diningStyles: [{ type: String }]
    },
  location: {
    country: String,
    city: String
  },
  profilePicture: String,
  userCode: String,
  connections: [{
    userCode: {type: String},
    userName: {type: String}
  }],
  likes: {type: Schema.Type.ObjectId, ref: 'Restaurant'},
  been: {type: Schema.Type.ObjectId, ref: 'Restaurant'},
  favourites: {type: Schema.Type.ObjectId, ref: 'Restaurant'},
  setupCompleted: Boolean,
  discardedRestaurants: {type: Schema.Type.ObjectId, ref: 'Restaurant'}
}
```

### Restaurant Model

```js
{
  name: String,
  location: {
    address1: String,
    address2: String,
    address3: String,
    city: String,
    state: String,
    zip_code: String,
    country: String
  },
  image_url: String,
  rating: Number,
  price: String,
  categories: {
    alias: String,
    title: String
  },
  restaurantId: String,
  restaurant_url: String
}
```

### Match Model

```js
{
  users: {type: Schema.Type.ObjectId, ref: 'User'},
  restaurant: {type: Schema.Type.ObjectId, ref: 'Restaurant'}
}
```

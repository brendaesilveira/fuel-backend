# Fuel Management Server

## Routes

### Auth Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /auth/signup | Creates a new user |
| POST   | /auth/login  | Logs the user      |
| GET    | /auth/verify | Verifies the JWT   |

### Navigation Routes

| Method | Route      | Description        |
| ------ | ---------- | ------------------ |
| GET    | /navigation/profile | Redirects to user's profile   |
| GET    | /navigation/profile/been  | Redirects to "Been" tab in user's profile   |
| GET    | /navigation/profile/saved | Redirects to "Saved" tab in user's profile  |
| GET    | /navigation/profile/liked | Redirects to "Liked" tab in user's profile  |

### Match Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| GET    | /match/:userId/matches | Retrieves matches for a user   |
| POST   | /match/create | Creates a new match   |

### Restaurants Routes

| GET    | /restaurant/restaurants | Fetches restaurant details   |

### Review Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /review/:restaurantId/reviews | Adds a review for a restaurant   |
| PUT    | /review/:restaurantId/reviews/:reviewId | Updates a review  |
| DELETE | /review/:restaurantId/reviews/:reviewId | Deletes a revieW  |

### User Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /user/:id/like | Likes a restaurant   |
| POST   | /user/:id/favorite | Adds a restaurant to favorites  |
| POST   | /user/:id/been | Marks a restaurant as visited   |
| POST   | /user/upload | Handles uploading a profile picture   |

## Models

### User Model

```js
{
  name: String,
  email: String,
  password: String,
  preferences: {
    cuisines: [String],
    foodTypes: [String],
    diningStyles: [String]
  },
  location: {
    country: String,
    city: String
  },
  profilePicture: String,
  userCode: String
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
  yelp_id: String
}
```

### Match Model

```js
{
  users: [ObjectId],
  restaurant: ObjectId
}
```

### Review Model

```js
{
  user: ObjectId,
  restaurant: ObjectId,
  rating: Number,
  text: String
}
```

### User Activity Model

```js
{
  user: ObjectId,
  activityType: String,
  restaurant: ObjectId
}
```

### User Connection Model

```js
{
  requester: ObjectId,
  recipient: ObjectId,
  status: String
}

```
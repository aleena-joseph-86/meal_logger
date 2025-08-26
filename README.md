# Meal Logger API

A simple Node.js/Express API for logging meals and managing users.

## Endpoints

### User Endpoints

#### `POST /users` - Register a new user

**Body:**

```json
{
  "name": "Aleena Joseph",
  "age": 21,
  "gender": "Female",
  "height": 165,
  "weight": 42
}
```

**Response:**

```json
{
  "user": {
    "name": "Aleena Joseph",
    "age": 21,
    "gender": "female",
    "height": 165,
    "weight": 42,
    "_id": "68ade706e378f373df0cc47b",
    "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
    "createdAt": "2025-08-26T16:55:34.784Z",
    "updatedAt": "2025-08-26T16:55:34.784Z",
    "__v": 0
  },
  "bmr": 1256.21
}
```

#### `GET /users/:userId` - Get user details by userId

**Params:**

- `userId` (string, required)
  **Response:**

```json
{
  "user": {
    "_id": "68ade706e378f373df0cc47b",
    "name": "Aleena Joseph",
    "age": 21,
    "gender": "female",
    "height": 165,
    "weight": 42,
    "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
    "createdAt": "2025-08-26T16:55:34.784Z",
    "updatedAt": "2025-08-26T16:55:34.784Z",
    "__v": 0,
    "bmr": 1256.21
  }
}
```

### Meal Endpoints

#### `POST /log_meals` - Log a new meal for a user

**Body:**

```json
{
  "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
  "meal": "lunch",
  "items": ["Jeera Rice", "Dal"],
}
```

**Response:**

```json
{
  "meal": {
    "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
    "meals": "lunch",
    "items": [
      "Jeera Rice",
      "Dal"
    ],
    "nutrition": {
      "calories": 430,
      "protein": 17,
      "carbs": 65,
      "fiber": 7
    },
    "loggedAt": "2025-08-26T12:00:00.000Z",
    "_id": "68ade779e378f373df0cc481",
    "createdAt": "2025-08-26T16:57:29.010Z",
    "updatedAt": "2025-08-26T16:57:29.010Z",
    "__v": 0
  },
  "unknownItems": []
}
```

#### `GET /meals?date=YYYY-MM-DD&userId=...` - Get all meals for a user on a specific date

**Query:**

- `date` (string, required, format: YYYY-MM-DD)
- `userId` (string, required)
  **Response:**

```json
{
  "date": "2025-08-26",
  "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
  "meals": [
    {
      "_id": "68ade779e378f373df0cc481",
      "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
      "meals": "lunch",
      "items": [
        "Jeera Rice",
        "Dal"
      ],
      "nutrition": {
        "calories": 430,
        "protein": 17,
        "carbs": 65,
        "fiber": 7
      },
      "loggedAt": "2025-08-26T12:00:00.000Z",
      "createdAt": "2025-08-26T16:57:29.010Z",
      "updatedAt": "2025-08-26T16:57:29.010Z",
      "__v": 0
    }
  ],
  "totals": {
    "calories": 430,
    "protein": 17,
    "carbs": 65,
    "fiber": 7
  }
}
```

#### `GET /status/:userId?date=YYYY-MM-DD` - Get daily nutrition status for a user

**Params:**

- `userId` (string, required)
  **Query:**
- `date` (string, optional, format: YYYY-MM-DD)
  **Response:**

```json
{
  "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
  "date": "2025-08-26",
  "totals": {
    "calories": 430,
    "protein": 17,
    "carbs": 65,
    "fiber": 7
  },
  "bmr": 1256.21,
  "mealsCount": 1
}
```

### Webhook Endpoint

#### `POST /webhook` - Log a meal via webhook message

**Body:**

```json
{
  "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
  "message": "log lunch: Jeera Rice, Dal"
}
```

**Response:**

```json
{
  "ok": true,
  "meal": {
    "userId": "e2ee17e6-cc08-4ab9-bf3c-fff6b25c63ce",
    "meals": "lunch",
    "items": [
      "Jeera Rice",
      "Dal"
    ],
    "nutrition": {
      "calories": 430,
      "protein": 17,
      "carbs": 65,
      "fiber": 7
    },
    "_id": "68ade8efe378f373df0cc48b",
    "loggedAt": "2025-08-26T17:03:43.352Z",
    "createdAt": "2025-08-26T17:03:43.353Z",
    "updatedAt": "2025-08-26T17:03:43.353Z",
    "__v": 0
  },
  "unknownItems": []
}
```

## Instructions to Run the App

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
   Or to start normally:
   ```sh
   npm start
   ```
3. **API will be available at:**

   http://localhost:3000

## Project Structure

- `src/models/` - Mongoose models for User and Meal
- `src/routes/` - Express route handlers for users, meals, and webhook
- `src/utils/` - Utility functions (e.g., food database)

---

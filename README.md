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
    /* user object */
  },
  "bmr": 1700
}
```

#### `GET /users/:userId` - Get user details by userId

**Params:**

- `userId` (string, required)
  **Response:**

```json
{
  "user": {
    /* user object, includes bmr */
  }
}
```

### Meal Endpoints

#### `POST /log_meals` - Log a new meal for a user

**Body:**

```json
{
  "userId": "<userId>",
  "meal": "lunch",
  "items": ["Jeera Rice", "Dal"],
  "loggedAt": "2025-08-26T12:00:00Z" // optional
}
```

**Response:**

```json
{
  "meal": {
    /* meal object */
  },
  "unknownItems": ["Unknown Food"] //foods not present in /utils/food_db.js
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
  "userId": "<userId>",
  "meals": [
    /* array of meal objects */
  ],
  "totals": { "calories": 1200, "protein": 50, "carbs": 200, "fiber": 20 }
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
  /* nutrition status object */
}
```

### Webhook Endpoint

#### `POST /webhook` - Log a meal via webhook message

**Body:**

```json
{
  "userId": "<userId>",
  "message": "log lunch: Jeera Rice, Dal"
}
```

**Response:**

```json
{
  /* same as POST /log_meals */
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

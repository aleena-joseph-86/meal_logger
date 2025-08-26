const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/users");
const mealsRouter = require("./routes/meals");
const webhookRouter = require("./routes/webhook");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/users", usersRouter);
app.use("/", mealsRouter); // contains /log_meals and /meals and /status
app.use("/", webhookRouter); // contains /webhook

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/meal_logger";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

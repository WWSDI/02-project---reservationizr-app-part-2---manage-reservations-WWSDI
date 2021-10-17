const express = require("express");
const cors = require("cors");
const RestaurantModel = require("./models/RestaurantModel");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  const allRestaurants = await RestaurantModel.find({});
  console.log("😱", allRestaurants);
  res.status(200).send(allRestaurants);
});

module.exports = app;

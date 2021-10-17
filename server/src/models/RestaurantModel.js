// FIXME: Add a Mongoose model here
const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});
const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);

module.exports = RestaurantModel;

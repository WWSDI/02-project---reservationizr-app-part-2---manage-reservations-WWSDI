const express = require("express");
const cors = require("cors");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const { celebrate, Joi, errors, Segments } = require('celebrate');
const app = express();


app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  const allRestaurants = await RestaurantModel.find({});
  console.log("😱", allRestaurants);
  res.status(200).send(allRestaurants);
});

// Need celebrate&joi for data validation
app.post("/reservations", 
// celebrate(Joi.object({

// })),
async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  console.log("😱", body);
  try {
    // date: > current timestamp
    // const date = new Date(body.date);
    const newReservation = await ReservationModel.create(body);
    res.status(200).send(newReservation);
  } catch (err) {
    console.log("😱", err);
    res.status(400).send("400");
    // user not authenticated error
    res.status(401).send("401");
  }
});

module.exports = app;

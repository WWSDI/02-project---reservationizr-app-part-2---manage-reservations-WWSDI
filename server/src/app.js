const express = require("express");
const cors = require("cors");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const app = express();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-2aqg2v5b.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://www.reservationizr.com",
  issuer: "https://dev-2aqg2v5b.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(cors());
app.use(express.json());

// ✅ 1 status code: 200
app.get("/restaurants", async (req, res) => {
  const allRestaurants = await RestaurantModel.find({});
  res.status(200).send(allRestaurants);
});

// 3 status code: 200, 400, 404
app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const foundRestaurant = await RestaurantModel.findById(id);
  console.log("✅foundRestaurant", foundRestaurant);
  res.status(200).send(foundRestaurant);
});

// 2 status code: 200, 401
app.get("/reservations", jwtCheck, async (req, res) => {
  const allReservations = await ReservationModel.find({});
  res.status(200).send(allReservations);
});

// 5 status code: 200, 400, 401, 403, 404
app.get("/reservations/:id", jwtCheck, async (req, res) => {
  const { id } = req.params;
  const foundReservation = await ReservationModel.findById(id);
  console.log("foundReservation", foundReservation);
  res.status(200).send(foundReservation);
});

// 3 status code: 200, 400, 401
app.post(
  "/reservations",
  jwtCheck,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().min(1).max(30).required(),
      date: Joi.date()
        // reservation datetime should be at least 1hr more than current datetime
        .greater(new Date(Date.now() + 1000 * 60 * 60))
        .required(),
      restaurantName: Joi.string().min(2).max(50).required(),
    }),
  }),
  async (req, res) => {
    const {
      body: { restaurantName, date, partySize },
      user: { sub: userId },
    } = req;

    const newReservation = { date, partySize, userId, restaurantName };
    // console.log("😱newReservation", newReservation);

    try {
      const createdReservation = await ReservationModel.create(newReservation);
      // console.log("😱 createdReservation", createdReservation);
      res.status(201).send(createdReservation);
    } catch (err) {
      console.log("😱", err);
      if (err.name === "SyntaxError") {
        res.status(400).send("400");
      } else {
        // user not authenticated error
        res.status(401).send("401");
      }
    }
  },
);

app.use(errors());

module.exports = app;

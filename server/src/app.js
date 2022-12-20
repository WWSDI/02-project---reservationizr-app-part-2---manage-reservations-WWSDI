const express = require("express");
const cors = require("cors");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const app = express();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const { isValidObjectId } = require("mongoose");
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

// Health check path for Zero Downtime Deployment
app.get("/", async (req, res) => {
  console.log("reservationizr api is running")
  res.status(200).send("reservationizr api is running");
})

app.get("/restaurants", async (req, res) => {
  const allRestaurants = await RestaurantModel.find({});
  res.status(200).send(allRestaurants);
});

app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foundRestaurant = await RestaurantModel.findById(id);
    if (!foundRestaurant) throw new Error("Restaurant NOT FOUND!");
    res.status(200).send(foundRestaurant);
  } catch (err) {
    if (!isValidObjectId(id)) {
      res.status(400).send({ error: "invalid id provided" });
    } else {
      res.status(404).send({ error: "restaurant not found" });
    }
  }
});

app.get("/reservations", jwtCheck, async (req, res) => {
  const { sub: userId } = req.user;
  const allMyReservations = await ReservationModel.find({ userId });
  res.status(200).send(allMyReservations);
});

app.get("/reservations/:id", jwtCheck, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  try {
    const foundReservation = await ReservationModel.findById(id);
    if (!foundReservation) throw new Error("NOT FOUND");
    if (foundReservation.userId !== userId)
      throw new Error("USER ID DO NOT MATCH");

    res.status(200).send(foundReservation);
  } catch (err) {
    if (!isValidObjectId(id)) {
      res.status(400).send({ error: "invalid id provided" });
    } else if (err.message === "USER ID DO NOT MATCH") {
      res.status(403).send({
        error: "user does not have permission to access this reservation",
      });
    } else {
      res.status(404).send({ error: "not found" });
    }
  }
});

app.post(
  "/reservations",
  jwtCheck,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().integer().min(1).max(30).required(),
      date: Joi.date()
        // reservation datetime should at least be 15 mins greater than current datetime
        .greater(new Date(Date.now() + 1000 * 60 * 15))
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
    const createdReservation = await ReservationModel.create(newReservation);
    res.status(201).send(createdReservation);
  },
);

app.use(errors());

module.exports = app;

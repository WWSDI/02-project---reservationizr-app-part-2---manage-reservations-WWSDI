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

app.get("/restaurants", async (req, res) => {
  const allRestaurants = await RestaurantModel.find({});
  res.status(200).send(allRestaurants);
});

// Need celebrate&joi for data validation
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
      userId: Joi.string().required(),
      restaurantName: Joi.string().min(2).max(70).required(),
    }),
  }),
  async (req, res) => {
    const { body } = req;
    console.log("😱", body);
    try {
      const newReservation = await ReservationModel.create(body);
      res.status(200).send(newReservation);
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

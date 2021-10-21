// FIXME: Add a Mongoose model here

const { Schema, model } = require("mongoose");

const ReservationSchema = new Schema(
  {
    partySize: { type: Number, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
    restaurantName: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);
const ReservationModel = model("Reservation", ReservationSchema);

module.exports = ReservationModel;

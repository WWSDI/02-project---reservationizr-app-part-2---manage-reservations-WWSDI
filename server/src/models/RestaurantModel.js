// FIXME: Add a Mongoose model here
const {Schema, model} = require("mongoose");

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
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
const RestaurantModel = model("Restaurant", RestaurantSchema);

module.exports = RestaurantModel;

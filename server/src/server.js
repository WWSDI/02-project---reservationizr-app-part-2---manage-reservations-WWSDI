// WARNING: the PORT env var will be shown as undefined when run locally because npm package dotenv is not installed. 
const port = process.env.PORT || 5111;
const { connect } = require("mongoose");
const app = require("./app");

const mongoDbUri = process.env.MONGO_URI || "mongodb://localhost:27017/mongo";

connect(mongoDbUri);

app.listen(port, () => {
  if (port) console.log(`API server listening on port ${port}`);
});

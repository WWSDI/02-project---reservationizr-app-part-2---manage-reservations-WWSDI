const port = process.env.PORT;
const { connect } = require("mongoose");
const app = require("./app");

const mongoDbUri = process.env.MONGO_URI || "mongodb://localhost:27017/mongo"

connect(mongoDbUri)

app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});

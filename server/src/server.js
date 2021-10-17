const port = process.env.PORT || 5000;
const { connect } = require("mongoose");
const app = require("./app");

connect("mongodb://localhost:27017/mongo")

app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});

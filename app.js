// app
// This file sets up Express.js application.
// It initializes Express and connects to the MongoDB database using Mongoose.
// It listens on a specified port for incoming HTTP requests.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB error:", err);
  });

const routes = require("./routes");

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

// app
// This file sets up Express.js application.
// It initializes Express and connects to the MongoDB database using Mongoose.
// It listens on a specified port for incoming HTTP requests.

const express = require("express");
const mongoose = require("mongoose");

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

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

// Hardcode User Object
// app.use((req, res, next) => {
//   req.user = {
//     _id: "660ee7cb7b31ec7abf7d7373", // temporary test user ID
//   };
//   next();
// });

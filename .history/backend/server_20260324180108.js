const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const contactRoute = require("./routes/contact");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/contact", contactRoute);

// connect DB + start server
sequelize.sync().then(() => {
  console.log("Database connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const contactRoute = require("./routes/contact");

const app = express();
CON

app.use(cors());
app.use(express.json());

app.use("/contact", contactRoute);

// connect DB + start server
sequelize.sync().then(() => {
  console.log("Database connected");

  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
});
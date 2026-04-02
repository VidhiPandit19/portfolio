const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.log("Error:", err));

module.exports = sequelize;
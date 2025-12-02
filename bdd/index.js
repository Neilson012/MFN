const { Sequelize } = require("sequelize")
require("dotenv").config()

const Name = process.env.DB_NAME;
const User = process.env.DB_USER;
const Host = process.env.DB_HOST;
const Password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(Name, User, Password, {
    dialect: "mysql",
    host: Host,
});

module.exports =  sequelize;

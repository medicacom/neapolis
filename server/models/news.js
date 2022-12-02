var Sequelize = require("sequelize");
var configuration = require("../config");
var config = configuration.connection;

// create a sequelize instance with our local postgres database information.
const sequelize = new Sequelize(config.base, config.root, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  operatorsAliases: false,
});

// setup news model and its fields.
var news = sequelize.define(
  "news",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      unique: false,
      allowNull: true,
    },
    date: {
      type: Sequelize.DATEONLY,
      unique: false,
      allowNull: true,
    },
    file: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    etat: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      defaultValue: 1,
    },
  },
  { timestamps: false, charset: "utf8", collate: "utf8_general_ci" }
);

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() => {
    console.log(
      "news table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export news model for use in other files.
module.exports = news;

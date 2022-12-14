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

// setup gouvernorat model and its fields.
var gouvernorat = sequelize.define(
  "gouvernorat",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    libelle: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
    },
    libelle_en: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
    },
    libelle_ar: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
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
  .then(() =>
    console.log(
      "Gouvernorat table has been successfully created, if one doesn't exist"
    )
  )
  .catch((error) => console.log("This error occured", error));

// export gouvernorat model for use in other files.
module.exports = gouvernorat;

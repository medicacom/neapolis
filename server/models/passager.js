var Sequelize = require("sequelize");
var bcrypt = require("bcrypt");
var Role = require("./role");
var gouvernorat = require("./gouvernorat");
var configuration = require("../config");
const specialite = require("./specialite");
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

// setup passager model and its fields.
var passager = sequelize.define(
  "passagers",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    prenom: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    tel: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    id_sp: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: specialite,
        key: "id",
      },
    },
  },
  { timestamps: false, charset: "utf8", collate: "utf8_general_ci" }
);

passager.belongsTo(specialite, { as: "specialites", foreignKey: "id_sp" });

// create all the defined tables in the specified database.
sequelize.sync() 
  .then(() => {
    console.log(
      "passagers table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export passager model for use in other files.
module.exports = passager;

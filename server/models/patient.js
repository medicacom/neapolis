var Sequelize = require("sequelize");
var configuration = require("../config");
var ages = require("./age");
var user = require("./user");
var indication = require("./indication");
var passager = require("./passager");
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

// setup age model and its fields.
var patient = sequelize.define(
  "patients",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    initiales: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    age: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    sexe: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    dateNaissance: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    agePatient: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    id_user: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: user,
        key: "id",
      },
    },
    ageCategorie: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: ages,
        key: "id",
      },
    },
    id_indication: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: indication,
        key: "id",
      },
    },
    id_passager: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: passager,
        key: "id",
      },
    },
    poid: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    taille: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    allergie: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
); 

patient.belongsTo(user, { as: "users", foreignKey: "id_user" });

patient.belongsTo(ages, { as: "ages", foreignKey: "ageCategorie" });

patient.belongsTo(indication, {
  as: "indications",
  foreignKey: "id_indication",
});

patient.belongsTo(passager, { as: "passagers", foreignKey: "id_passager" });

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() => {
    console.log(
      "patients table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export age model for use in other files.
module.exports = patient;

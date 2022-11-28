var Sequelize = require("sequelize");
var configuration = require("../config");
var patient = require("./patient");
var user = require("./user");
var medicament = require("./medicament");
var effet_indesirable = require("./effet_indesirable");
var indication = require("./indication");
var voix = require("./voix_administration");
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
var rapport = sequelize.define(
  "rapports",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    id_patient: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: patient,
        key: "id",
      },
    },
    id_eff: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: effet_indesirable,
        key: "id",
      },
    },
    dateDebut: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    dateFin: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    information: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    complementaires: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    id_medicament: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: medicament,
        key: "id",
      },
    },
    dateDebutAdmin: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    dateFinAdmin: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    id_voix: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: voix,
        key: "id",
      },
    },
  },
  { timestamps: false }
);

rapport.belongsTo(patient, { as: "patients", foreignKey: "id_patient" });

rapport.belongsTo(user, { as: "users", foreignKey: "id_user" });

rapport.belongsTo(medicament, { as: "medicaments", foreignKey: "id_medicament" });

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() => {
    console.log(
      "rapports table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export age model for use in other files.
module.exports = rapport;

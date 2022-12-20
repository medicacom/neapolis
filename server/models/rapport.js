var Sequelize = require("sequelize");
var configuration = require("../config");
var patient = require("./patient");
var user = require("./user");
var medicament = require("./medicament");
var effet_indesirable = require("./effet_indesirable");
var voix = require("./voix_administration");
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
    posologie: {
      type: Sequelize.FLOAT,
      unique: false,
      allowNull: true,
    },
    numero: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
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
    id_medicament: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: medicament,
        key: "id",
      },
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
    effet: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    /* id_eff: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: effet_indesirable,
        key: "id",
      },
    }, */
    id_voix: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: voix,
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
    id_passager: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      references: {
        model: passager,
        key: "id",
      },
    },
    description_eff: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    grave: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    hospitalisation: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    pronostic: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    incapacite: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    deces: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    anomalie: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    autre: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    traites: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    evolution: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    survenus: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
    },
    date_admin: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    therapeutique: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
  },
  { timestamps: false, charset: "utf8", collate: "utf8_general_ci" }
);

rapport.belongsTo(patient, { as: "patients", foreignKey: "id_patient" });

rapport.belongsTo(user, { as: "users", foreignKey: "id_user" });

rapport.belongsTo(medicament, {
  as: "medicaments",
  foreignKey: "id_medicament",
});

/* rapport.belongsTo(effet_indesirable, {
  as: "effet_indesirables",
  foreignKey: "id_eff",
}); */

rapport.belongsTo(voix, { as: "voix_administrations", foreignKey: "id_voix" });

rapport.belongsTo(passager, { as: "passagers", foreignKey: "id_passager" });

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

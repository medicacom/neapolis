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

// setup age model and its fields.
var age = sequelize.define(
  "ages",
  {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    description_en: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    description_ar: {
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
  .sync({alter:true})
  .then(() => {
    console.log(
      "Ages table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export age model for use in other files.
module.exports = age;

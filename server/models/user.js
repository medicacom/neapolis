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

// setup User model and its fields.
var User = sequelize.define(
  "users",
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
    etat: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      defaultValue: 1,
    },
    password: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    token: {
      type: Sequelize.TEXT,
      unique: false,
      allowNull: true,
    },
    code: {
      type: Sequelize.TEXT,
      unique: false,
      allowNull: true,
    },
    valider: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      defaultValue: 0,
    },
    id_role: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    id_gouvernorat: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      defaultValue: 23,
      references: {
        model: gouvernorat,
        key: "id",
      },
    },
    id_sp: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
      defaultValue: 120,
      references: {
        model: specialite,
        key: "id",
      },
    },
    autre_sp: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
  },
  { timestamps: false, charset: "utf8", collate: "utf8_general_ci" }
);

User.belongsTo(Role, { as: "roles", foreignKey: "id_role" });

User.belongsTo(gouvernorat, {
  as: "gouvernorats",
  foreignKey: "id_gouvernorat",
});

User.belongsTo(specialite, { as: "specialites", foreignKey: "id_sp" });

User.beforeCreate((user, options) => {
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);
});

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// create all the defined tables in the specified database. 
sequelize
  .sync()
  .then(() => {
    User.findAll().then(function (u) {
      if (u.length == 0) {
        User.create({
          nom_prenom: "admin",
          email: "admin@admin.com",
          tel: 0,
          id_role: 1,
          password: "26411058mk",
          etat: 1,
        });
      }
    });
    console.log(
      "users table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export User model for use in other files.
module.exports = User;

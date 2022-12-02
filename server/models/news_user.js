var Sequelize = require("sequelize");
var configuration = require("../config");
var user = require("./user");
var news = require("./news");
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

// setup news_user model and its fields.
var news_user = sequelize.define(
  "news_user",
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
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    id_news: {
      type: Sequelize.INTEGER,
      unique: false,
      onDelete: "cascade",
      allowNull: false,
      references: {
        model: news,
        key: "id",
      },
    },
  },
  { timestamps: false }
);

news_user.belongsTo(user, { as: "users", foreignKey: "id_user" });

news_user.belongsTo(news, { as: "news", foreignKey: "id_news" });

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() => {
    console.log(
      "news_user table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) => console.log("This error occured", error));

// export news_user model for use in other files.
module.exports = news_user;

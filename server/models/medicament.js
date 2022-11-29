var Sequelize = require('sequelize');
var configuration = require("../config");
var indication = require('./indication');
var voix_administration = require('./voix_administration');
var config = configuration.connection;
	
// create a sequelize instance with our local postgres database information.
const sequelize = new Sequelize(config.base, config.root, config.password, {
	host:config.host,
	port: config.port,
	dialect:'mysql',
	pool:{
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}, 
	operatorsAliases: false
});

// setup medicaments model and its fields.
var medicaments = sequelize.define('medicaments', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
	nom: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true, 
      
  },
	form: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true,         
  },
	dosage: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true,         
  },
  id_voix: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false,
    references: {
      model: voix_administration,
      key: "id",
    },
  },
  id_indication: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false,
    references: {
      model: indication,
      key: "id",
    },
  },
  etat: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: true,
    defaultValue: 1,
  },
}, { timestamps: false });

medicaments.belongsTo(voix_administration, { as: "voix_administrations", foreignKey: "id_voix" });

medicaments.belongsTo(indication, { as: "indications", foreignKey: "id_indication" });

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => {
        console.log('medicaments table has been successfully created, if one doesn\'t exist'); 
    })
    .catch(error => console.log('This error occured', error));

// export medicaments model for use in other files.
module.exports = medicaments;
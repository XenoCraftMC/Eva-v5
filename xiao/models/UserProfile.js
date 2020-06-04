const Sequelize = require('sequelize');

const Database = require('/app/xiao/structures/Sequelize');

const UserProfile = Database.db.define('userProfiles', {
	userID: Sequelize.STRING,
	inventory: {
		type: Sequelize.STRING,
		defaultValue: '[]'
	},
	money: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	balance: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	networth: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	experience: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	personalMessage: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	background: {
		type: Sequelize.STRING,
		defaultValue: 'default'
	},
    dob: {
    type: Sequelize.STRING,
    defaultValue: ''
  }
});

module.exports = UserProfile;

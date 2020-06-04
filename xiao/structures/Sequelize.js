const Sequelize = require('sequelize'),
      winston = require('winston'),
      database = new Sequelize('mainDB', null, null, {
  		dialect: "sqlite",
  		storage: '/app/xiao/data/databases/profile.sqlite',
  		operatorsAliases: false,
  		logging: false
		});

class Database {
	static get db() {
		return database;
	}

	static start() {
		database.authenticate()
			.then(() => console.log('[SEQUELIZE]: Connection to database has been established successfully.'))
			.then(() => console.log('[SEQUELIZE]: Synchronizing database...'))
			.then(() => database.sync()
				.then(() => console.log('[SEQUELIZE]: Done Synchronizing database!'))
				.catch(error => console.error(`[SEQUELIZE]: Error synchronizing the database: \n${error}`))
			)
			.catch(error => {
				console.error(`[SEQUELIZE]: Unable to connect to the database: \n${error}`);
				console.error(`[SEQUELIZE]: Try reconnecting in 5 seconds...`);
				setTimeout(() => Database.start(), 5000);
			});
	}
}

module.exports = Database
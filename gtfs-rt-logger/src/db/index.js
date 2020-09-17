const { Pool } = require('pg');
const fs = require('fs');

details = {
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: process.env.POSTGRES_PORT
};
// 
pool = new Pool(details);
// 
// // client.connect()
// client.query('SELECT NOW()', (err, res) => {
//   console.log("hello");
//   client.end();
// })

// pool.connect().catch((e) => {
// 	console.error(e.stack);
// });

module.exports = {
	initialize_tables: () => {
		var sql = fs.readFileSync('src/SQL/create_table_positions.sql').toString();
		pool.query(sql).then(res => {
			console.log(res);
		}).catch(err => {
			console.error(err.stack);
		});
	}
}
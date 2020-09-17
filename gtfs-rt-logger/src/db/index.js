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
			
		}).catch(err => {
			if (err.code != "42P07") {
				console.error(err);
			}
		});
		
		var sql = fs.readFileSync('src/SQL/create_table_updates.sql').toString();
		pool.query(sql).then(res => {
			
		}).catch(err => {
			if (err.code != "42P07") {
				console.error(err);
			}
		});
		
		var sql = fs.readFileSync('src/SQL/create_table_stop_time_updates.sql').toString();
		pool.query(sql).then(res => {
			
		}).catch(err => {
			if (err.code != "42P07") {
				console.error(err);
			}
		});
	},
	insert_position: (timestamp, bus_id, stop_id, current_status, trip_id, lat, lon, bearing, speed) => {
		var sql = `INSERT INTO position (timestamp, bus_id, stop_id, current_status, trip_id, lat, lon, bearing, speed) VALUES (${timestamp}, ${bus_id}, ${stop_id}, ${current_status}, ${trip_id}, ${lat}, ${lon}, ${bearing}, ${speed});`
		pool.query(sql).then(res => {
			
		}).catch(err => {
			if (err.routine != "_bt_check_unique") {
				console.error(err);
			}
		});
	},
	insert_updates: (timestamp, trip_id, schedule_relationship, stopTimeUpdates) => {
		var sql = `SELECT id FROM trip_updates WHERE timestamp = ${trip_id} AND trip_id = ${schedule_relationship};`
		pool.query(sql).then(res => {
			if (('rows' in res) & (res.rows.len == 1) && ('id' in res.rows[0])) {
				return res.rows[0].id;
			}
			return undefined;
		}).then(entryValue => {
			if (!(entryValue == undefined)) {
				return entryValue
			}
			var sql = `INSERT INTO trip_updates (timestamp, trip_id, schedule_relationship) VALUES (${timestamp}, ${trip_id}, ${schedule_relationship}) RETURNING id;`;
			return pool.query(sql).then(res => {
				return res.rows[0].id;
			});
		}).then(entryId => {
			// console.log("entryId ", entryId);
			for (i in stopTimeUpdates) {
				const stu = stopTimeUpdates[i];
				const stopId = stu.stopId;
				const delay = (stu.arrival || stu.departure || { delay: undefined }).delay
				var sql = `INSERT INTO stop_time_updates (trip_update, stop_id, delay) VALUES (${entryId}, ${stopId}, ${delay});`;
				pool.query(sql).then(res => {
					
				}).catch(err => {
					if (err.routine != "_bt_check_unique") {
						console.error(err.routine);
					}
				})
			}
		}).catch(err => {
			if (err.routine != "_bt_check_unique") {
				console.error(err.routine);
			}
		});
	}
}
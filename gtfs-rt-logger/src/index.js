const { Client } = require('pg');
const { protobuf } = require('protobufjs');
const fetch = require('node-fetch');
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const url = process.env.GTFS_RT_URL;

details = {
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: process.env.POSTGRES_PORT
};

client = new Client(details);

client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})

function log_rt() {
	console.log(url);
	fetch(url).then(res => res.text()).then(body => {
		var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
		feed.entity.forEach(function(entity) {
		  if (entity.trip_update) {
			console.log(entity.trip_update);
		  }
		});
	}).catch((error) => {
		console.error(error);
	});
}

setInterval(log_rt, 1000*10);
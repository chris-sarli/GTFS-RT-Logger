const { Client } = require('pg');
const fetch = require('node-fetch');
const fs = require('fs');
const positions_url = process.env.GTFS_RT_URL_VEHICLEPOSITIONS;
const updates_url = process.env.GTFS_RT_URL_TRIPUPDATES;
var protobuf = require("protobufjs");


// details = {
// 	user: process.env.POSTGRES_USER,
// 	host: process.env.POSTGRES_HOST,
// 	database: process.env.POSTGRES_DB,
// 	password: process.env.POSTGRES_PASSWORD,
// 	port: process.env.POSTGRES_PORT
// };
// 
// client = new Client(details);
// 
// client.connect()
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })

function log_rt() {
	const fetch_positions = fetch(positions_url)
	const updates_positions = fetch(updates_url)
	
	fetch_positions.then(res => res.buffer()).then(body => {
		protobuf.load("static/gtfs-realtime.proto")
		.then(function(root) {
		   var FeedMessage = root.lookupType("transit_realtime.FeedMessage")
		   
		   var message = FeedMessage.decode(body);
		   var entity = message.entity;
		   
		   for (item in entity) {
			   const vehicle = entity[item].vehicle;
			   const trip = vehicle.trip;
			   const position = vehicle.position;
			   const currentStatus = vehicle.currentStatus;
			   const timestamp = vehicle.timestamp.low;
			   const stopId = vehicle.stopId;
			   const vehicleId = vehicle.vehicle.id;
			   console.log(`${timestamp}: Bus ${vehicleId} @ Stop ${stopId} (${currentStatus}) on ${trip.tripId} (${trip.routeId}), ${position.latitude}, ${position.longitude}, bearing ${position.bearing}, ${position.speed}mph`);
		   }
		   
		});
	}).catch((error) => {
		console.error(error);
	});
	
}
log_rt();
// setInterval(log_rt, 1000*15);
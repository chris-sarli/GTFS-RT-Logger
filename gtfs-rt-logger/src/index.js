const fetch = require('node-fetch');
const positions_url = process.env.GTFS_RT_URL_VEHICLEPOSITIONS;
const updates_url = process.env.GTFS_RT_URL_TRIPUPDATES;
var protobuf = require("protobufjs");
const db = require('./db');


function log_rt() {
	const fetch_positions = fetch(positions_url)
	const fetch_updates = fetch(updates_url)
	
	fetch_positions.then(res => res.buffer()).then(body => {
		protobuf.load("static/gtfs-realtime.proto")
		.then(function(root) {
		   var FeedMessage = root.lookupType("transit_realtime.FeedMessage")
		   
		   var message = FeedMessage.decode(body);
		   var entity = message.entity;
		   
		   for (item in entity) {
			   const vehicle = entity[item].vehicle;
			   const tripId = vehicle.trip.tripId;
			   const position = vehicle.position;
			   const lat = position.latitude;
			   const lon = position.longitude;
			   const bearing = position.bearing;
			   const speed = position.speed;
			   const currentStatus = vehicle.currentStatus;
			   const timestamp = vehicle.timestamp.low;
			   const stopId = vehicle.stopId;
			   const vehicleId = vehicle.vehicle.id;
			   // console.log(`${timestamp}: Bus ${vehicleId} @ Stop ${stopId} (${currentStatus}) on ${trip.tripId} (${trip.routeId}), ${position.latitude}, ${position.longitude}, bearing ${position.bearing}, ${position.speed}mph`);
			   
			   db.insert_position(timestamp, vehicleId, stopId, currentStatus, tripId, lat, lon, bearing, speed);
		   }
		   
		});
	}).catch((err) => {
		if (err.routine != "_bt_check_unique") {
			console.error(err);
		}
	});
	
	fetch_updates.then(res => res.buffer()).then(body => {
		protobuf.load("static/gtfs-realtime.proto")
		.then(function(root) {
		   var FeedMessage = root.lookupType("transit_realtime.FeedMessage")
		   
		   var message = FeedMessage.decode(body);
		   var entity = message.entity;
		   
		   for (item in entity) {
			   const tripUpdate = entity[item].tripUpdate;
			   const trip = tripUpdate.trip;
			   const timestamp = tripUpdate.timestamp.low;
			   const stopTimeUpdates = tripUpdate.stopTimeUpdate;
			   // console.log(`${timestamp}: ${trip.tripId} (${trip.routeId}) | ${trip.scheduleRelationship} | ${stopTimeUpdates.length} Updates`);
			   
			   db.insert_updates(timestamp, trip.tripId, trip.scheduleRelationship, stopTimeUpdates);
		   }
		   
		});
	}).catch((err) => {
		if (err.routine != "_bt_check_unique") {
			console.error(err);
		}
	});
	
}
db.initialize_tables();
log_rt();
setInterval(log_rt, 1000*15);
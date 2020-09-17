const { Client } = require('pg');
// const { protobuf } = require('protobufjs');
const fetch = require('node-fetch');
const fs = require('fs');
// var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const url = process.env.GTFS_RT_URL;
var protobuf = require("protobufjs");
// console.log(protobuf);
// 
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
	fetch(url).then(res => res.buffer()).then(body => {
		protobuf.load("static/gtfs-realtime.proto")
		.then(function(root) {
		   var FeedMessage = root.lookupType("transit_realtime.FeedMessage")
		   
		   var message = FeedMessage.decode(body);
		   var entity = message.entity;
		   // console.log(entity);
		   for (item in entity) {
			   console.log(entity[item]);
		   }
		   
		});
	}).catch((error) => {
		console.error(error);
	});
	
}
log_rt();
// setInterval(log_rt, 1000*15);
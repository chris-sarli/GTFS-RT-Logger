create table if not exists stop_time_updates
(
	trip_update int not null,
	stop_id int,
	delay smallint
);


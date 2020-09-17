create table if not exists position
(
	timestamp int,
	bus_id smallint,
	stop_id int,
	current_status smallint,
	trip_id int,
	lat real,
	lon real,
	bearing smallint,
	speed real
);

create unique index position_timestamp_bus_id_uindex
	on position (timestamp, bus_id);

alter table position
	add constraint position_pk
		primary key (timestamp, bus_id);


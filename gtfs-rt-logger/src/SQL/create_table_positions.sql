create table if not exists pos
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

create unique index pos_timestamp_bus_id_uindex
	on pos (timestamp, bus_id);

alter table pos
	add constraint pos_pk
		primary key (timestamp, bus_id);


create table if not exists trip_updates
(
	id serial not null,
	timestamp int,
	trip_id int,
	schedule_relationship smallint
);

create unique index trip_updates_id_uindex
	on trip_updates (id);

create unique index trip_updates_timestamp_trip_id_uindex
	on trip_updates (timestamp, trip_id);

alter table trip_updates
	add constraint trip_updates_pk
		primary key (id);


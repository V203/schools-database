drop table subject cascade;
create table subject(
    id serial not null primary key,
    name text not null UNIQUE,
    CHECK (name <> '')
);
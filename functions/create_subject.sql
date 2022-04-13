create or replace function 
	create_subject ( the_name text )
	returns void as
$$
begin

insert into subject (name) values (the_name);
end;
$$
Language plpgsql;
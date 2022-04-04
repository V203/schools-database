

-- add more teachers please
-- add more teachers please

-- add more teachers please



create or replace function 
	add_teacher ( 
		the_name text,
		the_surname text,
		the_email text
	)
	returns boolean as
$$
declare
-- declare a variable to be used in the function
emailCount int;

begin

	-- run a query to check if the email address exists
	select into emailCount count(*) from teacher 
		where email = the_email;

	-- if total is 0 the subject doesn't exist
	if (emailCount = 0 AND the_name != ' ' AND the_surname != ' ' AND the_email != ' ' ) then
	
		-- then create the teacher
		insert into teacher (first_name, last_name, email) 
			values (the_name, the_surname, the_email);

		return true;
	else
		-- returns false if the teacher with this email address already exists
		return false;
	end if;

end;
$$
Language plpgsql;
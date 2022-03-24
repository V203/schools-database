
-- Create a function called find_teachers_for_subject that returns all the teachers that teach a 
-- specified subject.

create type teacher_type as (
	id int,
	first_name text,
	last_name text,
	email text
);

DROP FUNCTION find_teachers_for_subject(text);

create or replace function find_teachers_for_subject (
	subject_name text
)
	returns table (
		the_teacher teacher_type
	) as
$$
begin

return query
	
	select 
		teacher.* 
	from teacher
		join teacher_subject on teacher.id = teacher_subject.teacher_id
		join subject on teacher_subject.subject_id = subject.id
	where 
		subject.name = subject_name;

end;
$$
Language plpgsql;

select * from find_teachers_for_subject('Mathematics');

select 
	teacher.* 
	from teacher
	join teacher_subject on teacher.id = teacher_subject.teacher_id
	join subject on teacher_subject.subject_id = subject.id
	where 
	subject.name = 'Mathematics';

select teacher.* 
from teacher_subject 
	join teacher on teacher.id = teacher_subject.teacher_id
where subject_id = 1;
	
select * from subject;
select * from teacher;



-- which parameters comes into our function?

-- teacher_id
-- subject_id

-- check if the teacher & subject id is valid
select * from subject where id = 3;
select * from teacher;

-- check if the subject is already linked to the teacher
select count(*) from teacher_subject where teacher_id = 2 and subject_id = 1;

-- if it's not linked to the teacher - add the subject to the teacher

insert into teacher_subject (teacher_id, subject_id) values (3, 1);

-- now return true

-- else if we can't link it

-- return false


--

select link_teacher_to_subject(6, 3);
select link_teacher_to_subject(6, 6);
select link_teacher_to_subject(6, 6);

select * from teacher_subject where teacher_id = 6;

create or replace function 
	link_teacher_to_subject ( 
		the_teacher_id int,
		the_subject_id int
	)
	returns boolean as
$$
declare
-- declare a variable to be used in the function

teacherCount int;
subjectCount int;
teacherSubjectCount int;

begin
	
	-- check if the teacher & subject id is valid
	select into teacherCount count(*) from subject where id = the_teacher_id;
	select into subjectCount count(*) from teacher where id = the_subject_id;
	
	-- if this is a valid teacher & subject id
	if (teacherCount = 1 and subjectCount = 1) then
		-- check if the subject is already linked to the teacher
		select 
			into teacherSubjectCount count(*) 
		from teacher_subject 
		where teacher_id = the_teacher_id 
			and subject_id = the_subject_id;
		
		if (teacherSubjectCount = 0) then
			-- I can add the subject to the teacher...
			insert into teacher_subject (teacher_id, subject_id) 
				values (the_teacher_id, the_subject_id);
			return true;
		
		else
			return false;
		end if;
		
	else
		return false;
	end if;

end;
$$
Language plpgsql;







-- 







select count(*) from teacher where email = 'bob@bloggs.com';

insert into teacher (first_name, last_name, email) values ('John', 'Bloggs', 'joe@bloggs.com');


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
	if (emailCount = 0) then
	
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


select * from add_teacher('Joe', 'Bloggs', 'bob@bloggs.com');

select * from teacher;
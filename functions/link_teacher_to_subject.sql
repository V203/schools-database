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
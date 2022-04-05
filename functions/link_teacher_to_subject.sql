create or replace function 
	link_teacher_to_subject ( 
		the_teacher_id int,
		the_subject_id int
	)
	returns boolean as
$$

begin
			insert into teacher_subject (teacher_id, subject_id) values (the_teacher_id, the_subject_id);
			return true;
		
end;
$$
Language plpgsql;
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

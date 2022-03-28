create or replace function find_teachers_teaching_multiple_subjects()
    returns table( 
         id int,
         last_name text,
         first_name text,
         email text,
         
    )
        as $$
        declare our_count
            begin

        return query 
         select 
 teacher.*,count(subject.name) into our_count
from teacher
join teacher_subject on "teacher".id = "teacher_subject".teacher_id
join subject on "teacher_subject".subject_id = subject.id group by "teacher".id having count("subject".name) > 1;

end;
$$
Language plpgsql


--  select 
--  teacher.*, count(subject.name)
-- from teacher
--   join teacher_subject on teacher.id = teacher_subject.teacher_id
--  join subject on teacher_subject.subject_id = subject.id group by teacher.id having count(subject.name) > 1;
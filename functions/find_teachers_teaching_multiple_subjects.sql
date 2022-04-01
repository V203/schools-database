create or replace function find_teachers_teaching_multiple_subjects()
    returns table( 
         last_name text,
         first_name text,
         subject_count bigint
        --  email text
         
    )
        as $$
        declare our_count int;
            begin
-- count(*)
        return query 
         select  teacher.first_name ,teacher.last_name , count(*)
        from teacher
        join teacher_subject on "teacher".id = "teacher_subject".teacher_id
        join subject on "teacher_subject".subject_id = subject.id group by "teacher".id having count("subject".name)  > 1 order by count desc;

end;
$$
Language plpgsql
-- count("subject".name)


--  select 
--  teacher.*, count(subject.name)
-- from teacher
--   join teacher_subject on teacher.id = teacher_subject.teacher_id
--  join subject on teacher_subject.subject_id = subject.id group by teacher.id having count(subject.name) > 1;
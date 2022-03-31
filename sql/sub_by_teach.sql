

create or replace function sub_by_teach(the_id int)

returns table (name text )
as

$$

begin

return query 
select 
  subject.name 
 from teacher
  join teacher_subject on teacher.id = teacher_subject.teacher_id
  join subject on teacher_subject.subject_id = subject.id
 where teacher_subject.teacher_id = the_id;

end;

$$
Language plpgsql;
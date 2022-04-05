create or replace function get_teacher_by_id(id_teacher int)
    returns table (id int, first_name text, last_name text)
as $$

begin
return query select teacher.id, teacher.first_name, teacher.last_name from teacher where teacher.id = id_teacher ;

end;
$$
Language plpgsql
create
or replace function get_teachers () returns table (
    id int,
    first_name text,
    last_name text
   
)
as
$$ 
begin
return query select
   teacher.id, teacher.first_name, teacher.last_name
from
    teacher;
   
    end;
$$
Language plpgsql;
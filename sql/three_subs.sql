drop function three_sub();
create or replace function three_sub()

  returns table(id int, last_name text ) 
  
  as $$
   begin 
   return query
    select
    "teacher".id,
    "teacher".last_name
    from
        teacher;


end;

$$
 Language plpgsql
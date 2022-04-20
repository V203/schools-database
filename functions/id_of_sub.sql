create or replace function id_of_sub(sub_name text)

    returns table (id int ,name text)

    as $$
    begin

    return query
    select 
    subject.id,
    subject.name
    
    from subject where subject.name = sub_name;

    end;
    $$
    Language plpgsql

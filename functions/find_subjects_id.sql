create or replace function find_subjects_id(sub_id int)

    returns table (id int ,name text)

    as $$
    begin

    return query
    select 
    subject.id,
    subject.name
    
    from subject where subject.id = sub_id;

    end;
    $$
    Language plpgsql

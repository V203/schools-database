create or replace function find_subjects(id int)

    returns table (subject_id int , subject_name text)

    as $$
    begin

    return query
    select 
    "subject".id,
    "subject".name
    from subject where subject.id = id;

    end;
    $$
    Language plpgsql

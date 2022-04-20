create or replace function find_subjects()

    returns table (subject_id int , subject_name text)

    as $$
    begin

    return query
    select 
    "subject".id,
    "subject".name
    from subject;

    end;
    $$
    Language plpgsql

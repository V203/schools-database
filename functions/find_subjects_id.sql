create or replace function find_subjects_id()

    returns table (id int )

    as $$
    begin

    return query
    select 
    "subject".id
    
    from subject;

    end;
    $$
    Language plpgsql

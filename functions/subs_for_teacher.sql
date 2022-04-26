create or replace function subs_for_teacher(t_id int)

    returns table (teach_id int,sub_id int, subject_name text)

    as $$
    begin

    return query
    select teacher_subject.teacher_id, teacher_subject.teacher_id, subject.name from teacher_subject join subject on teacher_subject.subject_id = subject.id where teacher_subject.teacher_id = t_id;

    end;
    $$
    Language plpgsql
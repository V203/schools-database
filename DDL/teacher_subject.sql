drop table teacher_subject cascade;
create table teacher_subject (
	teacher_id int not null  ,
	subject_id int not null ,
	foreign key (teacher_id) references teacher(id),
	foreign key (subject_id) references subject(id)

);
CREATE UNIQUE INDEX index_name ON teacher_subject(teacher_id, subject_id);
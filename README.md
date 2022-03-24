# Database workshop

## The domain

In our previous workshop we looked into the schools scenario below and came up with a data model:

`A local council wants to keep track of subjects at local schools in the region. They would like to know which schools are teaching which subjects, which teachers are teaching which subjects. They are also interested to know which subjects are the most and least popular.`

## The data model

 Table name   | columns 
-----------|---------------------
 grade    | id, name
 school   | id, name, region
 teacher  | id, first_name, last_name, email, school_id
 subject  | id, name
 subject_teacher | subject_id, teacher_id
 learner | id, first_name, last_name, email, grade_id
 learner_subject | subject_id, learner_id
 learner_school  | learner_id, school_id, current_school
 
We will focus on the `subject` & `teacher` tables in this workshop and use it to explore how to create tables, sql queries, User Defined Functions & User Defined Types.

We will be using `psql` to run `sql` script from the command line.

## Create folder

Create a folder called `schools-database` in your `projects` (or other working) folder.

## Create a database

Start off by creating the database

```
createdb schools
```

### If you are using Ubuntu

You might need to create the new schools database like this:

```
sudo -u postgres createdb schools;
```

Then give your user access to the schools database, using these commands.

First connect to `psql` as the `postgres` user.

```
sudo -u postgres psql;
```

You might need to create a postgres user that match the current username you are using.

But you might already have done this in the past.

```
sudo -u postgres createuser your_user_name -P;
```

Grant access to the `schools` database to your current user.

```
grant all privileges on database schools to your_user_name;
```

## Connect to the database using psql

Connect to the database use `psql`.

```
psql -d schools
```

## Create tables

Let's start off by creating some tables.

Use this DDL (Database Definition Language) script to create a teacher table.

Create a folder called `sql` in your `schools-database` folder. 

In that folder create a file called `create_teacher.sql`

Put the sql script below into that folder:

```sql
create table teacher(
	id serial not null primary key,
	first_name text not null,
	last_name text not null,
	email text not null
);
```

Create the table by running this command in `psql`

```sql
\i sql/create_teacher.sql
```

Use the `\d` command in `psql` to see the table that has been created.

## Add teachers

Create a new file in the `sql` folder called `add_teachers.sql` and create at least 5 teachers in the `teacher` table.

Use an insert query like this:

```sql
insert into teacher (first_name, last_name, email) values ('Lindani', 'Pani', 'lindani@email.com');
insert into teacher (first_name, last_name, email) values ('Siba', 'Khumalo', 'siba@khumalo.com');

-- add more teachers please

```

Run the script using `psql`

```sql
\i sql/add_teachers.sql
```

Use a select statement to see all the teachers in the database.

```sql
select * from teacher;
```

You can run this directly in psql.

## Create a subject table

Now create a `subject` table in the database using this DDL script:

```sql
create table subject(
	id serial not null primary key,
	name text
);
```

Create file called `create_subject.sql` in the `sql` folder.

Run the script using `psql`.

## Create some Subjects

Create these subjects in the Subject table:

* Mathematics
* Geography
* Life Sciences
* History
* Consumer Studies
* Accounting
* Economics

Use an insert script like this:

```sql
insert into subject(name) values('Mathematics');
-- add more insert scripts 
```

Create a file called `insert_subjects.sql` in the `sql` folder.

## Linking subjects to a teacher

You can store `teachers` and `subjects` now, but you need a way of specifying which subjects a teacher can teach. For that you will be creating a link table called `teacher_subject`. This relationship between a `teacher` and a `subject` is a `many-to-many` as a teacher can teach **many subjects** and a subject can be taught by **many teachers**.

Create the `teacher_subject` table using the script below.

```sql
create table teacher_subject (
	teacher_id int not null,
	subject_id int not null,
	foreign key (teacher_id) references teacher(id),
	foreign key (subject_id) references subject(id)
);
```

To link teachers with subjects you will now need the `ids` from the `teacher` & `subject` tables.

Link a subject to a teacher using this query:

```
insert into teacher_subject (teacher_id, subject_id) values (<teacher_id>, <subject_id>)
```

Link some teachers to subjects using this query, ensure 2 teachers are linked to 3 or more subjects. Be carefull to not link a teacher to the same subject twice.


## Joining teacher with subjects.

To see which subjects a teacher teaches you will need to join the `teacher` and the `subject` table via the `teacher_subject` table.

To join the `teacher` with the `subject` table use a join like this:

```sql
select * from teacher
	join teacher_subject on teacher.id = teacher_subject.teacher_id
	join subject on teacher_subject.subject_id = subject.id;
```

Try it out and make sure you are happy with how the query is working.

### Find all the Maths teachers

How would you write a query that can find all the teachers that teaches `Mathematics`?

**Tip:** add a where clause for `subject.name`

Like this:

```sql
select 
	teacher.* 
from teacher
 	join teacher_subject on teacher.id = teacher_subject.teacher_id
	join subject on teacher_subject.subject_id = subject.id
where 
	subject.name = 'Mathematics';
```

## More queries

How would you write queries for:
* finding all the teachers that teaches 3 or more than subjects,
* finding all the subjects a teacher teaches.

For the `3 subjects` query you will need to use a `group by` using a `count(*)` with a `having` clause like this.

```sql
select 
   teacher.first_name, teacher.last_name, teacher.email, count(*)  
from teacher
	join teacher_subject on teacher.id = teacher_subject.teacher_id
	join subject on teacher_subject.subject_id = subject.id
group by 
   teacher.first_name, teacher.last_name, teacher.email
having count(*) > 3;
```

You can learn more about group by queries here:
* https://www.postgresqltutorial.com/postgresql-group-by/
* https://www.postgresqltutorial.com/postgresql-having/

**To do:** Create the query that returns all the subjects taught by a given teacher

## Create User Defined Functions (UDF)

In PostgreSQL you can create your own functions (User Defined Functions) which can combines various SQL statements. A function can take parameters, do some processing and then return some values.

> Use the `\df` command in `psql` to see all the functions in the database.

You can learn more about functions here: https://www.postgresqltutorial.com/postgresql-stored-procedures/

Stored procedures and functions are similar in PostgreSQL - we will be focussing on functions.

### Your first function

Create a function called `find_subjects` that returns all subjects in the database.

Using this script, create a `functions` folder and put the script below in there using a name of `find_subjects.sql`

Execute it with `psql` using `\i functions/find_subjects.sql`

```sql
create or replace function find_subjects ()
	returns table (
		id int,
		name text
	) as
$$
begin

return query
	select 
		"subject".id, 
		"subject".name
	from subject;

end;
$$
Language plpgsql;
```

To run the function in `psql` use this command:

```
select * from find_subjects();
```

This function is not that useful as you might as well query the table directly and get the same result, but it shows you what is possible and how to create a basic function in PostgreSQL.

### A function doing more

Let's do something more useful and create a function called `create_subject` that can add Subjects to the database and ensure that the Subject names are unique:


```sql
create or replace function 
	create_subject ( the_name text )
	returns boolean as
$$
declare
-- declare a variable to be used in the function
total int;

begin

	-- run a query to check if the subject name exists
	select into total count(*) from subject 
		where LOWER(name) = LOWER(the_name);

	-- if total is 0 the subject doesn't exist
	if (total = 0) then
		-- then create the subject
		insert into subject (name) values (the_name);
		-- and returns true if the subject was created already
		return true;
	else
		-- returns false if the subject already exists
		return false;
	end if;

end;
$$
Language plpgsql;
```

You will see this function looks much more interesting:

* It contains more than one sql query,
* it declares some variables,
* and it even contains an `if` statement.

To run this function use this command `select *  from create_subject('Geography');` in `psql`.


### Create these functions

* Create a function called `add_teacher` that adds a new teacher and ensures that the `email` for the `teacher` is unique. If the email is not unique the teacher should not be added to the database and the function should return false.

* Create a function called `link_teacher_to_subject` that links a teacher to a subject and ensures that a `teacher` is not linked to a subject more than once.

* Create a function called `find_teachers_for_subject` that returns all the teachers that teach a specified `subject`.

* Create a function called `find_teachers_teaching_multiple_subjects` that returns all the teachers that teach the specified number of subjects.

Learn more here:

* User defined functions in PostgreSQL: https://www.postgresqltutorial.com/postgresql-create-function/
* If statements in PostgreSQL functions: https://www.postgresqltutorial.com/plpgsql-if-else-statements/

## Create User Defined Types (UDT)

User defined types can be created and returned from functions.

> Using the `\dT` command you cna see the user defined types in the dataase. Use `\d <type_name>` to see the columns in the type.


A typical create script for a User defined type looks like this:

```
CREATE TYPE subject_type AS (
    id INT,
    name text
); 
```

Change your `find_subjects` function to use `subject_type`.

You will need to delete it first by using this command:

```sql
drop function find_subjects();
```

And then recreate it using this script:


```sql
create or replace function find_subjects ()
	returns table (
		subject_row subject_type
	) as
$$
begin

--
return query
select 
	"subject".id, 
	"subject".name
from subject;

end;
$$
Language plpgsql;
```

More info about creating User Defined Types in PostgreSQL: https://www.postgresqltutorial.com/postgresql-user-defined-data-types/

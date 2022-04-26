module.exports = Services = (pool) => {

    let add_teacher = async (name, last_name, email) => {
        await pool.query(`select * from add_teacher('${name}','${last_name}','${email}')`);

    }

    let add_subject = async (subject_name) => {
        try {

            await pool.query(`select * from create_subject('${subject_name}')`)
            return { bool: true, msg: `${subject_name} subject successfully added to the database.` }

        } catch (error) {

            if (error.code === '23505') {
                console.log(error.code);
                return { bool: false, msg: `${subject_name} subject aleady exists in the database.` }
            } else if (error.code === '23514') {
                return { bool: false, msg: `Please enter a name of the subject you wish to register to the database.` }
            }


        }
    }

    let get_teachers = async () => (await pool.query(`select * from get_teachers()`)).rows;


    let get_subjects = async () => (await pool.query(`select * from find_subjects()`)).rows

    let multi_sub_teachers = async () => (await pool.query(`select * from find_teachers_teaching_multiple_subjects()`)).rows

    let assign_teach_subject = async (teach_id, sub_id) => {
        try {

            await pool.query(`select * from link_teacher_to_subject(${teach_id},${sub_id})`)
            return { bool: true, msg: `${(await get_teach_by_id(teach_id)).first_name} ${(await get_teach_by_id(teach_id)).last_name} successfully assigned to ${(await get_sub_by_id(sub_id)).name}` }
        } catch (error) {
            if (error.code === '23505') {
                return { bool: false, msg: `Already Assigned to the selected subject` }
            } else if (error.code === '42601') {
                return { bool: false, msg: `Please choose a teacher and a subject to assign to.` }
            } else if (error.code === '23503') {
                return { bool: false, msg: `Please select a subject to assign the teacher` }
            }
            console.log(error);
        }
    }

    let multi_sub_teachers_v2 = async (par) => {
        par = (await pool.query(`select * from find_teachers_teaching_multiple_subjects()`)).rows
        let temp = par.map(el => el.id);
        for (let i = 0; i < par.length; i++) {
            par[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
        }
        return par
    }

    let get_sub_by_id = async (sub_id) => (await pool.query(`select * from find_subjects_id(${sub_id})`)).rows[0]

    let get_teach_by_id = async (id) => (await pool.query(`select * from get_teacher_by_id(${id})`)).rows[0];

    let subs_for_teacher = async (id) => (await pool.query(`select * from subs_for_teacher( ${id})`)).rows

    let teacher_status = async (par) => {

        let status_obj = {}
        let subjects = await subs_for_teacher(par)
        status_obj['subjects_for_teach'] = subjects.map(el => el.subject_name)
        let par_ = await get_teach_by_id(par)
        status_obj['display'] = subjects.length === 0 ? `${par_.first_name}  ${par_.last_name} has not yet been assigned any subjects.` : `If necessary, assign ${par_.first_name} ${par_.last_name} additional subjects.`;
        return status_obj
    }

    let subject_status = async (subject_name) => {
        

        let status_obj = {}
        status_obj['teachers'] = await get_teachers_for_sub(subject_name)

        status_obj['display'] = status_obj.teachers.length === 0 ? `${subject_name} has not yet been assigned any teachers` : `If necessary, assign more teachers to the subject.`;

        return status_obj
    }

    let clearDB = async () => {
        await pool.query("TRUNCATE TABLE teacher RESTART IDENTITY CASCADE");
        await pool.query("TRUNCATE TABLE subject RESTART IDENTITY CASCADE");
        await pool.query("TRUNCATE TABLE teacher_subject RESTART IDENTITY CASCADE");
    }

    let backupData = async () => {
        await clearDB()
        await add_subject("Mathematics");
        await add_subject("English");
        await add_subject("Biology");
        await add_subject("Physics");
        await add_subject("Life-Orientation");
        await add_subject("Afrikaans");

        await add_teacher("Vuyisa", "Ndubela", "vm@email.com");
        await add_teacher("Loli", "Poppins", " popins@email.com");
        await add_teacher("Keith", "Steve", "ks@email.com");
        await add_teacher("Mat", "Jones", "mj@gmail.com");
        await add_teacher("Brian", "Stones", "bstone@email.com");
    }

    let get_teachers_for_sub = async (name) => {
        let teachers = (await pool.query(`select * from find_teachers_for_subject('${name}')`)).rows
        // teachers.forEach(el => console.log(el));
        return teachers;
    }


    return {
        add_teacher,
        add_subject,
        get_teachers,
        get_subjects,
        multi_sub_teachers,
        multi_sub_teachers_v2,
        assign_teach_subject,
        get_teach_by_id,
        get_sub_by_id,
        subs_for_teacher,
        clearDB,
        backupData,
        teacher_status,
        subject_status,
        get_teachers_for_sub

    }
}
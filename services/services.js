module.exports = Services = (pool) => {

    let add_teacher = async (name, last_name, email) => {
        await pool.query(`select * from add_teacher('${name}','${last_name}','${email}')`);

    }

    let add_subject = async (subject_name) => {
        try {
            
            await pool.query(`select * from create_subject('${subject_name}')`)
            return  { bool: true, msg: `${subject_name} subject successfully added to the database.` }
            
        } catch (error) {

            if (error.code === '23505') {
                console.log(error.code);
                return {bool:false, msg:`${subject_name} subject aleady exists in the database.`}
            }else if (error.code === '23514'){
                return {bool:false, msg:`Please enter a name of the subject you wish to register to the database.`}
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

    return {
        add_teacher,
        add_subject,
        get_teachers,
        get_subjects,
        multi_sub_teachers,
        multi_sub_teachers_v2,
        assign_teach_subject,
        get_teach_by_id,
        get_sub_by_id

    }
}
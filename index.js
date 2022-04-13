const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const pg = require('pg');
const req = require('express/lib/request');
const Pool = pg.Pool;
const app = express();
let dbe = pg.DatabaseError

const PORT = process.env.PORT || 3010;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/schools';


app.use(express.json());
app.use(express.urlencoded({ extended: false }));





// console.log(doc);

app.use(express.static('public'));
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


const pool = new Pool({
    connectionString, ssl: {
        rejectUnauthorized: false
    }
});

var emsg;
var smsg;



// var new_teachers = async () =>  (await pool.query("Select * from get_teachers()")).rows;

app.get("/add_teacher", async (req, res) => res.render("add_teacher"));

app.post("/subject", async (req, res) => {
    try {
        
        
        if ((await pool.query(`select * from create_subject('${req.body.sub_name}')`))) {
            const the_sub = (await pool.query("select * from find_subjects()")).rows;
            console.log(smsg);
            the_sub
            req.flash('sub_added', `The ${req.body.sub_name} subject was successfully added to the database.`);
            smsg = req.flash('sub_added');
            res.render('subject', { the_sub, smsg })
        }
    } catch (error) {

        if (error.detail) {

            the_sub
            req.flash('error', `The ${req.body.sub_name} subject already exists in the database.`);
            emsg = req.flash('error');
            res.render('subject', { emsg, the_sub })

        }
    }



});


app.get('/subject', async (req, res) => {
    const the_sub = (await pool.query("select * from find_subjects()")).rows;
    // setTimeout(function () { return msg = req.flash('exist') }, 3000);
    res.render("subject", { the_sub })
});

app.get("/teacher", async (req, res) => {
    let teachers = (await pool.query("Select * from get_teachers()")).rows;
    res.render('teacher', { teachers });
});

// req.setFlash()

app.post("/teacher", async (req, res) => {
    if (((await pool.query(`select add_teacher('${req.body.fname}','${req.body.lname}','${req.body.email}')`)).rows[0]['add_teacher'])) {
        let teachers = (await pool.query("Select * from get_teachers()")).rows;
        req.flash("added", `Teacher ${req.body.fname} ${req.body.lname} successfully added to the database.`)
        smsg = req.flash("added")
        res.render('teacher', { teachers, smsg })
    } else {
        let teachers = (await pool.query("Select * from get_teachers()")).rows;
        req.flash('rejected', `Teacher ${req.body.fname} ${req.body.lname} already exists in the database`)
        emsg = req.flash('rejected')
        res.render('teacher', { teachers, emsg })
    }


});

app.get("/", async (req, res) => {
    // console.log( await new_teachers());
    
    // console.log(qr);
    const multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;

    let temp = multi_subs.map(el => el.id)
    for (let i = 0; i < multi_subs.length; i++) {
        multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
    }

    const subs = (await pool.query("select * from find_subjects()")).rows

    const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    res.render("index", { multi_subs, subs, teachers })
})

app.post("/", async (req, res) => {







    let valid_insert = async (teacher_param,subject_param)=>{
        console.log(teacher_param + " "+ subject_param);
        if(teacher_param === "" || subject_param == ""){
            console.log(teacher_param);
            let subs = (await pool.query("select * from find_subjects()")).rows
            let multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
            let teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
            
            // console.log(teacher);
            // let teacher = (await pool.query(`select * from get_teacher_by_id(${teacher_param})`)).rows[0];
            req.flash("not_added", `Please select teacher and subject to assign the teacher to.`);
            let temp = multi_subs.map(el => el.id)
            for (let i = 0; i < multi_subs.length; i++) {
                multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
            }
            // req.flash("teacher_added", `Teacher`)
            emsg = req.flash('not_added');

            res.render('index', { emsg, multi_subs, subs, teachers });

        }else {
    
    
            try {
                
                await pool.query(`select * from link_teacher_to_subject('${teacher_param}','${subject_param}')`)
            } catch (error) {
                console.log(error);
            }
            let subs = (await pool.query("select * from find_subjects()")).rows
            let multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
            let teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
            let teacher = (await pool.query(`select first_name, last_name from get_teacher_by_id(${teacher_param})`)).rows['0'];
    
            let temp = multi_subs.map(el => el.id)
            for (let i = 0; i < multi_subs.length; i++) {
                multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
            }
            
            let subID = (await pool.query(`select  * from find_subjects_id('${subject_param}')`)).rows[0]['name'] 
            // console.log(subID);
            req.flash("teacher_added", `Teacher ${teacher.first_name} ${teacher.last_name} successfully assingned to teach ${subID}.`);
            smsg = req.flash('teacher_added');
            res.render('index', { smsg, multi_subs, subs, teachers });





    }
    
  
    
        
    }

    valid_insert(req.body.select_teacher,req.body.select_subject);
    
    
});
    // console.log(req.body);
    // try {
    //     console.log(req.body.select_subject + " "+ req.body.select_teacher);
    //     if () {
    //         let subs = (await pool.query("select * from find_subjects()")).rows
    //         let multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
    //         let teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    //     let teacher = (await pool.query(`select first_name, last_name from get_teacher_by_id(${req.body.select_teacher})`)).rows['0'];

    //     let temp = multi_subs.map(el => el.id)
    //     for (let i = 0; i < multi_subs.length; i++) {
    //         multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
    //     }
        
    //     let subID = (await pool.query(`select  * from find_subjects_id('${req.body.select_subject}')`)).rows[0]['name'] 
    //     // console.log(subID);
    //     req.flash("teacher_added", `Teacher ${teacher.first_name} ${teacher.last_name} successfully assingned to teach ${subID}.`);
    //     smsg = req.flash('teacher_added');
    //     res.render('index', { smsg, multi_subs, subs, teachers })
    
    // }else{

    //     console.log(error.error);
    //     try {
            
    //     } catch (error) {
    //         if(error){
    //             console.log(error.error);
    //         }
            // let subs = (await pool.query("select * from find_subjects()")).rows
            // let multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
            // let teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
            // let temp = multi_subs.map(el => el.id)
            // for (let i = 0; i < multi_subs.length; i++) {
            //     multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
            // }
            
            
            
            // req.flash("select both","Please select a teacher and a subject from the drop down buttons.")
            // esmg = req.flash('select both')
            // res.render('index', { emsg, multi_subs, subs, teachers })
            
        // }
            
        
        // }
    // }
    //   if (!await pool.query(`select * from link_teacher_to_subject('${req.body.select_teacher}','${req.body.select_subject}')`)){



    

app.get("/link_teacher", async (req, res) => {
    const subs = (await pool.query("select * from find_subjects()")).rows
    const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    res.render("link_teacher", { subs, teachers });
});

app.get("/subject_taught/:name", async (req, res) => {
    let subject = req.params.name
    console.log(subject);
    const teach_for_sub = (await pool.query(`select * from find_teachers_for_subject('${req.params.name}')`)).rows;
    res.render("subject_taught", { teach_for_sub, subject });
});

app.get("/teacher_taught/:id", async (req, res) => {
    let fname;
    let lname;
    let sub_by_teach = (await pool.query(`select * from sub_by_teach(${req.params.id})`)).rows;

    if (sub_by_teach.length === 0) {
        
        let the_teach = (await pool.query(`select * from get_teacher_by_id(${req.params.id})`)).rows;
        let the_teach_l = the_teach[0]['last_name']
        let the_teach_n = the_teach[0]['first_name']
        res.render("teacher_no_sub", {subs: (await pool.query("select * from find_subjects()")).rows, the_teach_l, the_teach_n ,id:req.params.id});
    } else {

        try {
            fname = sub_by_teach[0]['first_name']
            lname = sub_by_teach[0]['last_name']
        } catch (error) {
            console.log(error);
        }
        res.render("teacher_taught", { sub_by_teach, fname, lname });

    }
});

app.post("/teacher_no_sub",async (req,res)=>{
    
    await pool.query(`select * from link_teacher_to_subject(${req.body.teacher_id},${req.body.select_subject})`);
    
        
        
        res.redirect('/')
        


})

app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});



















// const subs = (await pool.query("select * from find_subjects()")).rows
    // const multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
    // const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    // if(error.detail){
    //     let temp = multi_subs.map(el => el.id)
    //     for (let i = 0; i < multi_subs.length; i++) {
    //         multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
    //         res.render('index', { smsg, multi_subs, subs, teachers })
    //         req.flash("select both","Please select a teacher and a subject from the drop down buttons.")
    //         esmg = req.flash('select both')
    //         res.render("index",{emsg,subs,multi_subs});
    //     }
    
    // }
    //     console.log(error.detail);
    // }
    // const multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
    // let temp = multi_subs.map(el => el.id)
    // for (let i = 0; i < multi_subs.length; i++) {
    //     multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
    // }
    // // console.log(document);
    // const subs = (await pool.query("select * from find_subjects()")).rows
    // const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    // res.redirect('/');
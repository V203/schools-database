const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const pg = require('pg');

const Pool = pg.Pool;
const app = express();
const er = Error;
const Services = require('./services/services');

const PORT = process.env.PORT || 3010;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/schools';


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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

let emsg;
let smsg;


let services = Services(pool);

app.post("/subject", async (req, res) => {

    let ourBool = await services.add_subject(req.body.sub_name);

        if(ourBool.bool === true){
            smsg = ourBool.msg
            emsg =''

        }else if(ourBool.bool === false){
            smsg = ''
            emsg = ourBool.msg
        }
        
        res.render('subject', { 
            the_sub: await services.get_subjects(),
            emsg ,
            smsg
        })


});


app.get('/subject', async (req, res) =>  res.render("subject", { the_sub:await services.get_subjects() }));

app.get("/teacher", async (req, res) => res.render('teacher', { teachers: await services.get_teachers() }));



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
    
    const multi_subs = await services.multi_sub_teachers()

    let temp = multi_subs.map(el => el.id)
    for (let i = 0; i < multi_subs.length; i++) {
        multi_subs[i]['subs_by_name'] = (await pool.query(`select * from sub_by_teach(${temp[i]})`)).rows;
    }

    const subs = await services.get_subjects();
    const teachers = await services.get_teachers();
    res.render("index", { multi_subs, subs, teachers })
})

app.post("/link", async (req, res) => {
    
   
    let t =  await services.assign_teach_subject(req.body.select_teacher,req.body.select_subject)
    if(t.bool === true){
        smsg =t.msg
        emsg = ''
    }else if (t.bool === false){
         emsg = t.msg
         smsg = ''
    }
   
    
    res.render('index',{
        smsg,emsg,
        teachers: await services.get_teachers(),
        multi_subs:await services.multi_sub_teachers_v2(await services.multi_sub_teachers()),
        subs:await services.get_subjects()});  
});
    
    

app.get("/link_teacher", async (req, res) => {
    const subs = (await pool.query("select * from find_subjects()")).rows
    const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    res.render("link_teacher", { subs, teachers });
});

app.post('/subject_no_teacher', async (req,res)=>{
    
    await pool.query(`select * from link_teacher_to_subject(${req.body.select_teacher},${req.body.sub_id})`);

    res.redirect('/');
});


app.get("/subject_taught/:name", async (req, res) => {
    let subject = req.params.name
    const teach_for_sub = (await pool.query(`select * from find_teachers_for_subject('${req.params.name}')`)).rows;
    console.log(teach_for_sub);
    if(teach_for_sub.length === 0 ){
        const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
        let temp_id = (await pool.query(`select * from id_of_sub('${req.params.name}')`)).rows[0]['id'];
        let temp_name = (await pool.query(`select * from id_of_sub('${req.params.name}')`)).rows[0]['name'];
        
        res.render('subject_no_teacher',{id:temp_id,name:temp_name,teachers});
    }else{
    res.render("subject_taught", { teach_for_sub, subject })};
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


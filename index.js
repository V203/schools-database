const express = require('express');
const exphbs = require('express-handlebars');
const res = require('express/lib/response');

const pg = require('pg');
const Pool = pg.Pool;

const app = express();
const PORT = process.env.PORT || 3017;


const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/schools';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static('public'));


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const pool = new Pool({
    connectionString, ssl: {
        rejectUnauthorized: false
    }
});




app.get('/', async (req, res) => {
    let all_teachers = (await pool.query("select * from get_teachers()")).rows;
    const the_sub = (await pool.query("select * from find_subjects()")).rows;
    res.render('index', { all_teachers ,the_sub});
});


app.get("/add_teacher", async (req, res) => res.render("add_teacher"));

app.get('/subject', async (req, res) => {
    const the_sub = (await pool.query("select * from find_subjects()")).rows;

    res.render("subject", { the_sub })
});


app.get("/teachers", async (req, res) => {
    let teachers = (await pool.query("Select * from get_teachers()")).rows;
    res.render('teachers', { teachers });
});

app.post("/add_teacher", async (req, res) => {
    // console.log(req.body);

    await pool.query(`select add_teacher('${req.body.fname}','${req.body.lname}','${req.body.email}')`)
    res.redirect('/');
});

app.get("/teachersmultiplesubjects", async (req, res) => {
    const multi_subs = (await pool.query("select * from find_teachers_teaching_multiple_subjects()")).rows;
    
    res.render("teachersmultiplesubjects", { multi_subs })
})

app.get("/link_teacher", async (req, res) => {
    const subs = (await pool.query("select * from find_subjects()")).rows
    const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows


    res.render("link_teacher", { subs, teachers });
});

app.post("/link_teacher", async (req, res) => {
    console.log(req.body);
    console.log( req.body.select_teacher);
    console.log( req.body.select_subject);
 
    await pool.query(`select * from link_teacher_to_subject('${req.body.select_teacher}','${req.body.select_subject}')`)
    res.redirect('/link_teacher');
});

app.get("/add_subject", async (req, res) => res.render("add_subject"));

app.post("/add_subject", async (req, res) => {
    req.body.sub_name
    await pool.query(`select create_subject('${req.body.sub_name}')`);
    res.redirect('/')
});

app.get("/subject_taught/:name", async (req,res) => {
    let subject = req.params.name
    const teach_for_sub = (await pool.query(`select * from find_teachers_for_subject('${req.params.name}')`)).rows;
    
    res.render("subject_taught",{teach_for_sub,subject});
});

app.get("/teacher_taught/:id", async (req,res)=>{
    try {
        
        
        let sub_by_teach = (await pool.query(`select * from sub_by_teach(${req.params.id})`)).rows;
        console.log(sub_by_teach);
        if(sub_by_teach === []){
            document.write("booo")
            // res.render("/");
        }else if (sub_by_teach){
            let fname = sub_by_teach[0]['first_name']
            let lname = sub_by_teach[0]['last_name']
           
            res.render("teacher_taught",{sub_by_teach, fname,lname});
        }
    } catch (error) {
        console.log(` sub by teach error ==> ${error}`)
    }

} );

app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});

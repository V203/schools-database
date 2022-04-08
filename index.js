const express = require('express');
const exphbs = require('express-handlebars');
const res = require('express/lib/response');
const session = require('express-session');
const pg = require('pg');
const Pool = pg.Pool;
const app = express();
const PORT = process.env.PORT || 3017;
const { flash } = require('express-flash-message');
const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/schools';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
        },
    })
);

app.use(flash({ sessionKeyName: 'flashMessage' }));


app.use(express.static('public'));


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars');
// app.set('views', './views');

const pool = new Pool({
    connectionString, ssl: {
        rejectUnauthorized: false
    }
});

// app.get('/', async (req, res) => {
//     let all_teachers = (await pool.query("select * from get_teachers()")).rows;
//     const the_sub = (await pool.query("select * from find_subjects()")).rows;
//     res.render('index', { all_teachers, the_sub });
// });

app.get("/add_teacher", async (req, res) => res.render("add_teacher"));

app.get('/subject', async (req, res) => {
    const the_sub = (await pool.query("select * from find_subjects()")).rows;
    res.render("subject", { the_sub })
});

app.get("/teacher", async (req, res) => {
    let teachers = (await pool.query("Select * from get_teachers()")).rows;
    console.log(teachers);
    res.render('teacher', { teachers });
});

app.post("/add_teacher", async (req, res) => {
    await pool.query(`select add_teacher('${req.body.fname}','${req.body.lname}','${req.body.email}')`)
    res.redirect('/');
});

app.get("/", async (req, res) => {
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

    try {
        await pool.query(`select * from link_teacher_to_subject('${req.body.select_teacher}','${req.body.select_subject}')`)

    } catch (error) {
        console.log(error.detail);
    }
    console.log(req.body);
    res.redirect('/');
});

app.get("/link_teacher", async (req, res) => {
    const subs = (await pool.query("select * from find_subjects()")).rows
    const teachers = (await pool.query("select id, first_name, last_name from get_teachers()")).rows
    res.render("link_teacher", { subs, teachers });
});

app.get("/add_subject", async (req, res) => res.render("add_subject"));

app.post("/add_subject", async (req, res) => {


    await pool.query(`select create_subject('${req.body.sub_name}')`)

    res.redirect('/subject')

});

app.get("/subject_taught/:name", async (req, res) => {
    let subject = req.params.name
    const teach_for_sub = (await pool.query(`select * from find_teachers_for_subject('${req.params.name}')`)).rows;

    res.render("subject_taught", { teach_for_sub, subject });
});

app.get("/teacher_taught/:id", async (req, res) => {
    console.log(req.params.id);
    let fname;
    let lname;
    let sub_by_teach = (await pool.query(`select * from sub_by_teach(${req.params.id})`)).rows;

    if (sub_by_teach.length === 0) {
        let the_teach = (await pool.query(`select * from get_teacher_by_id(${req.params.id})`)).rows;
        console.log(the_teach);
        let the_teach_l = the_teach[0]['last_name']
        let the_teach_n = the_teach[0]['first_name']
        res.render("teacher_no_sub", { the_teach_l, the_teach_n });
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

app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});

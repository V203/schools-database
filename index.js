const express = require('express');
const exphbs = require('express-handlebars');

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
    let all_teachers = (await pool.query("select all_teachers()")).rows;

    res.render('index', { all_teachers });
});


app.get("/add_teacher", async (req, res) => res.render("add_teacher"));

app.get('/subject', async (req, res) => {
    const the_sub = (await pool.query("select find_subjects()")).rows;

    res.render("subject", { the_sub })
});


app.get("/teachers", async (req, res) => {
    let teachers = (await pool.query("Select first_name from teacher")).rows;
    res.render('teachers', { teachers });
});

app.post("/add_teacher",async (req,res)=>{
    console.log(req.body);
    // const fname = req.body.fname
    // const lname = req.body.lname
    // const email = req.body.email
    await pool.query(`select add_teacher('${req.body.fname}','${req.body.lname}','${req.body.email}')`)
    res.redirect('/');
});

app.get("/teachersmultiplesubjects", async (req,res)=>{
    const multi_subs = (await pool.query("select find_teachers_teaching_multiple_subjects()")).rows
    res.render("teachersmultiplesubjects", {multi_subs})
})

app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});

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




app.get('/', function (req, res) {
	res.render('index');
});

// app.post("/",async (req,res)=>{
//     res.redirect("/index");
// });



app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});

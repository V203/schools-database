let assert = require('assert');
let Services = require("../services/services");
const pg = require('pg');

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/schoolsdb';

const pool = new Pool({
  connectionString
});

describe("Test of the schools database program", async () => {
  var c = 1;
  beforeEach(async function () {
    console.log(`***** Test No# ${c++} `);
    await pool.query("TRUNCATE TABLE teacher RESTART IDENTITY CASCADE ");
    await pool.query("TRUNCATE TABLE subject RESTART IDENTITY CASCADE ");
    await pool.query("TRUNCATE TABLE teacher_subject RESTART IDENTITY CASCADE ");
  });

 

  it("Should be able to get the teachers data by id",async ()=>{
    let services = Services(pool);

    await services.add_teacher("Loli", "Poppins", " popins@email.com");
    let actual = await services.get_teach_by_id(1);
    
    let expected = { id: 1, first_name: 'Loli', last_name: 'Poppins' }

    assert.deepEqual(actual,expected)
  })

  it("Should be able to add two teachers to the database and return the two teachers added to the database.", async () => {
    let services = Services(pool);
    await services.add_teacher("Vuyisa", "Ndubela", "vm@email.com");
    await services.add_teacher("Loli", "Poppins", " popins@email.com");
    let actual = await services.get_teachers();

    let expected = [
      { id: 1, first_name: 'Vuyisa', last_name: 'Ndubela' },
      { id: 2, first_name: 'Loli', last_name: 'Poppins' }
    ]
    
    

    assert.deepStrictEqual(expected, actual);


  })

  it("We should be able to add maths, english and biology to the database and return the three mentioned subjects", async () => {
    let services = Services(pool);

    await services.add_subject("Biology");
    await services.add_subject("English");
    await services.add_subject("Mathematics");

    let actual = await services.get_subjects();

    let expected = [
      { subject_id: 1, subject_name: 'Biology' },
      { subject_id: 2, subject_name: 'English' },
      { subject_id: 3, subject_name: 'Mathematics' }
    ]
    assert.deepEqual(expected, actual)
  })

  it("Assign teachers to subjects and return teachers with more 1 subject", async () => {
    let services = Services(pool);

    await services.add_subject("Mathematics");
    await services.add_subject("English");
    await services.add_subject("Biology");
    await services.add_subject("Physics");
    await services.add_subject("Life-Orientation");
    await services.add_subject("Afrikaans");

    await services.add_teacher("Vuyisa", "Ndubela", "vm@email.com");
    await services.add_teacher("Loli", "Poppins", " popins@email.com");
    await services.add_teacher("Keith", "Steve", "ks@email.com");
    await services.add_teacher("Mat", "Jones", "mj@gmail.com");
    await services.add_teacher("Brian", "Stones", "bstone@email.com");

    await services.assign_teach_subject(1, 1);
    await services.assign_teach_subject(1, 2);
    await services.assign_teach_subject(1, 4);
    await services.assign_teach_subject(2, 3);
    await services.assign_teach_subject(2, 4);
    await services.assign_teach_subject(4, 5);




    let actual = await services.multi_sub_teachers()
    let expected = [
      {
        first_name: 'Ndubela',
        id: 1,
        last_name: 'Vuyisa',
        subject_count: '3'
      },
      {
        first_name: 'Poppins',
        id: 2,
        last_name: 'Loli',
        subject_count: '2'
      }
    ]

    // console.log(actual);
    assert.deepEqual(actual, expected)
  });





  after(function () {
    pool.end();
  });

})
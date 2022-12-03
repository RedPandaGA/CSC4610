//import node-postgre to allow node to connect to postgre db
import * as pg from "pg";
const { Pool } = pg.default;

//import and initialize dotenv to read environment variables
import dotenv from "dotenv";
dotenv.config();

//get environment variables
const DBHOST = process.env.DBHOST;
const USER = process.env.DBUSER;
const PASS = process.env.DBPASS;
const DBNAME = process.env.DBNAME;
const DBPORT = process.env.DBPORT;

//Establishes a pool of connections to the database
const pool = new Pool({
  host: DBHOST,
  user: USER,
  password: PASS,
  database: DBNAME,
  port: DBPORT,
});

//Debug/util functions
//Gets all the tables in the current database
export async function getTableNames() {
  const { rows } = await pool.query(`
        SELECT *
        FROM pg_catalog.pg_tables
        WHERE schemaname != 'pg_catalog' AND 
            schemaname != 'information_schema';
    `);
  return rows;
}

//Gets all users in the current database
export async function getUsers() {
  const { rows } = await pool.query(`
        SELECT *
        FROM users
    `);
  return rows;
}

async function insertCourses(course) {
    await pool.query(`
        INSERT INTO courses (dept, cid, hrs, prereq)
        VALUES ($1,$2,$3,$4)
    `, [course.dept, course.cid, course.hrs, course.prereq])
    .then((res) => {
        console.log("course added")
    })
    .catch((err) => {
        console.log("error: " + err.stack)
    })
    return 0
}

// var newcourses = [
//     {dept: "CSC", cid: '1350', hrs: 3, prereq: [''] },
//     {dept: "CSC", cid: '1351', hrs: 3, prereq: ['CSC1350']  },
//     {dept: "CSC", cid: '3102', hrs: 3, prereq: ['CSC1351']  },
//     {dept: "CSC", cid: '2259', hrs: 3, prereq:  ['CSC1351']  },
//     {dept: "CSC", cid: '2262', hrs: 3, prereq: ['MATH2090']  },
//     {dept: "CSC", cid: '3380', hrs: 3, prereq: ['CSC1351']  },
//     {dept: "CSC", cid: '3501', hrs: 3, prereq: ['CSC2259']  },
//     {dept: "CSC", cid: '4330', hrs: 3, prereq: ['CSC3102', 'CSC3380']  },
//     {dept: "CSC", cid: '4103', hrs: 3, prereq: ['CSC3102']  },
//     {dept: "CSC", cid: '4101', hrs: 3, prereq: ['CSC3102']  },
//     {dept: "CSC", cid: '3200', hrs: 3, prereq: ['CSC3102', 'ENGL2000']  },
//     {dept: "MATH", cid: '1550', hrs: 3, prereq: ['']  },
//     {dept: "MATH", cid: '1552', hrs: 3, prereq: ['MATH1550']  },
//     {dept: "MATH", cid: '2090', hrs: 3, prereq: ['MATH1552']  },
//     {dept: "IE", cid: '3302', hrs: 3, prereq: ['MATH1552', 'CSC2259']  },
//     {dept: "ENGL", cid: '1001', hrs: 3, prereq:  ['']  },
//     {dept: "ENGL", cid: '2000', hrs: 3, prereq: ['']  },
// ]

// newcourses.forEach((course) => {
//     insertCourses(course)
// })

//Actual Functions

//Gets user data via searching for the username
export async function getUserByName(username){
    const { rows } = await pool.query(`
        SELECT *
        FROM users
        WHERE username = $1
    `, [username])
    return rows
}

//Creates a new entry in the users table, therefore creating a new user
export async function insertUser(username, password, email){
    let ret = null
    await pool.query(`
        INSERT INTO users (username, email, password)
        VALUES ($1,$2,$3)
    `,
      [username, email, password]
    )
    .then((dbres) => {
      ret = true;
    })
    .catch((err) => {
      console.log("error: " + err.stack);
      ret = false;
    });
  return ret;
}

//Changes the password value in the users row found by UID
export async function updatePassword(UID, newPassword){
    let ret = null
    await pool.query(`
        UPDATE users SET password = $1 WHERE uid = $2
    `, [newPassword, UID])
    .then(dbres => {
        ret = true
    })
    .catch(err => {
        ret = false
    })
    return ret
}

//Changes the username value in the users row found by UID
export async function updateUsername(UID, newUsername){
    let ret = null
    await pool.query(`
        UPDATE users SET username = $1 WHERE uid = $2
    `, [newUsername, UID])
    .then(dbres => {
        ret = true
    })
    .catch(err => {
        ret = false
    })
    return ret
}

//Changes the email value in the users row found by UID
export async function updateEmail(UID, newEmail){
    let ret = null
    await pool.query(`
        UPDATE users SET email = $1 WHERE "UID" = $2
    `, [newEmail, UID])
    .then(dbres => {
        ret = true
    })
    .catch(err => {
        ret = false
    })
    return ret
}

//Gets the value of password at the user row found by UID
export async function getPassword(UID){
    let ret = null
    await pool.query(`
        SELECT password FROM users WHERE uid = $1
    `, [UID])
    .then(dbres => {
        ret = dbres.rows[0]
    })
    .catch(err => {
        ret = false
    })
    return ret
}

export async function getCoursesByDept(dept){
    let ret = null
    await pool.query(`
        SELECT * FROM courses WHERE dept = $1
    `, [dept])
    .then((res) => {
        ret = res
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

export async function getUserSchedule(uid){
    let ret = null
    await pool.query(`
        SELECT scheduledata FROM userschedules WHERE uid = $1
    `, [uid])
    .then((res) => {
        ret = res
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

export async function getUserFlow(uid){
    let ret = null
    await pool.query(`
        SELECT flowdata FROM userflows WHERE uid = $1
    `, [uid])
    .then((res) => {
        ret = res
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

export async function saveUserSchedule(scheduledata, uid){
    let ret = null
    await pool.query(`
        UPDATE userschedules SET scheduledata = $1 WHERE uid = $2
    `, [JSON.stringify(scheduledata), uid])
    .then((res) => {
        ret = true
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

export async function saveUserflow(flowdata, uid){
    let ret = null
    await pool.query(`
        UPDATE userflows SET flowdata = $1 WHERE uid = $2
    `, [JSON.stringify(flowdata), uid])
    .then((res) => {
        ret = true
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

export async function getDepts(){
    let ret = null
    await pool.query(`
        SELECT dname FROM department
    `)
    .then((res) => {
        ret = res
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

export async function getPreFlows(){
    let ret = null
    await pool.query(`
        SELECT flowname, flowdata FROM preflows
    `)
    .then((res) => {
        ret = res
    })
    .catch((err) => {
        console.log(err.stack)
    })
    return ret
}

//Gets user data via searching for the id
export async function getUser(id){
    const { rows } = await pool.query(`
        SELECT *
        FROM users
        WHERE uid = $1
    `,
    [id]
  );
  return rows;
}


//Gets user data via searching for the email
export async function getUserByEmail(email){
    const { rows } = await pool.query(`
        SELECT *
        FROM users
        WHERE email = $1
    `,
    [email]
  );
  return rows;
}

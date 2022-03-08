const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");

// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:3000/Registration"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     key: "userId",
//     secret: "subscribe",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 24,
//     },
//   })
// );

const db = mysql.createConnection({
  host: 'localhost',
  user: 'miloni',
  password: 'mils',
  database: 'student_helper'
});


  // db.connect(function(err) {
    
  //   console.log("db connected");
  //   if (err) throw err;
  //   db.query("SELECT * FROM users", function (err, result, fields) {
  //     if (err) throw err;
  //     console.log(result);
      
  //   });
  // });

// app.post("/register", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) {
//       console.log(err);
//     }

//     db.query(
//       "INSERT INTO users (username, password) VALUES (?,?)",
//       [username, hash],
//       (err, result) => {
//         console.log(err);
//       }
//     );
//   });
// });

// app.get("/login", (req, res) => {
//   console.log("yo");
//   alert(req.body.username);
//   if (req.session.user) {
//     res.send({ loggedIn: true, user: req.session.user });
//   } else {
//     res.send({ loggedIn: false });
//   }
// });

// app.post("/login", (req, res) => {
//   alert(req.body.username);
//   const username = req.body.username;
//   const password = req.body.password;
//   console.log(username);
//   console.log(password);

//   db.query(
//     "SELECT * FROM users WHERE email = ?;",
//     username,
//     (err, result) => {
//       if (err) {
//         res.send({ err: err });
//       }

//       if (result.length > 0) {
//         if(password == result[0].password){
//           // req.session.user = result;
//           // console.log(req.session.user);
//           res.send(result);
//         }
//         else{
//           res.send({ message: "Wrong username/password combination!" });
//         }

//         // bcrypt.compare(password, result[0].password, (error, response) => {
//         //   if (response) {
//         //     req.session.user = result;
//         //     console.log(req.session.user);
//         //     res.send(result);
//         //   } else {
//         //     res.send({ message: "Wrong username/password combination!" });
//         //   }
//         // });
//       } else {
//         res.send({ message: "User doesn't exist" });
//       }
//     }
//   );
// });

app.post('/register', (req,res)=>{

  const username = req.body.username;
  const password = req.body.password;
  const fname = req.body.fname;
  const lname = req.body.lname;

  db.query("INSERT INTO users (email,password,first_name,last_name) VALUES (?,?,?,?)",
    [username,password,fname,lname],
    (err,result) => {
      console.log(err);
    }
  );
});

app.post('/login', (req,res)=>{

  const username = req.body.username;
  const password = req.body.password;

  db.query("SELECT * from users where email = ? AND password = ?",
    [username,password],
    (err,result) => {
      if(err){
        res.send({err: err});
      }
      if(result.length > 0)
        res.send(result);
      else{
        res.send({message : "Wrong username password combination"});
      }
    }
  );
});

app.listen(3001, () => {
  console.log("running server");
});

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
// const corsOptions={
//   origin: 'http://localhost:3000/Registration',
//   methods: ["GET", "POST"],
//   credentials: true,
//   optionSuccessStatus:200,
// }

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    // origin: '*',
    methods: ["GET", "POST"],
    credentials: true,
    optionSuccessStatus:200,
  })
);

// app.use(cors(corsOptions))

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 *1000,
    },
  })
);

const db = mysql.createConnection({
  host: '0.0.0.0',
  user: 'sh_admin',
  password: 'admin',
  database: 'student_helper'
});


  db.connect(function(err) {
    
    console.log("db connected");
    if (err) throw err;
    db.query("SELECT * FROM user", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      
    });
  });


app.post('/register', (req,res)=>{

  const username = req.body.username;
  const password = req.body.password;
  const fname = req.body.fname;
  const lname = req.body.lname;


    db.query("INSERT INTO user (email,password,first_name,last_name) VALUES (?,?,?,?)",
      [username,password,fname,lname],
      (err,result) => {
        console.log(err);
      }
    );

  // bcrypt.hash(password,saltRounds,(err,hash)=>{
    
  //   if(err){
  //     console.log("error in salt rounds");
  //     console.log(err);
  //   }
  //   db.query("INSERT INTO users (email,password,first_name,last_name) VALUES (?,?,?,?)",
  //     [username,password,fname,lname],
  //     (err,result) => {
  //       console.log(err);
  //     }
  //   );
  // });

});

app.get('/login', (req,res)=>{

  if(req.session.user){
    res.send({loggedIn : true, user : req.session.user});
  }
  else{
    res.send({loggedIn : false});  
  }

});

app.post('/login', (req,res)=>{

  const username = req.body.username;
  const password = req.body.password;

  db.query("SELECT * from user where email_id = ? AND password = ?",
    [username,password],
    (err,result) => {
      if(err){
        res.send({err: err});
      }
      if(result.length > 0){
        req.session.user = result;
        console.log(req.session.user);
        res.send(result);
      }
      else{
        res.send({message : "Wrong username password combination"});
      }
    }
  );



  // db.query("SELECT * from users where email = ?",
  //   username,
  //   (err,result) => {
  //     if(err){
  //       res.send({err: err});
  //     }
  //     if(result.length > 0){
  //       bcrypt.compare(password,result[0].password,(error, response)=>{
  //         if(response)
  //           res.send(result);
  //         else 
  //           res.send({message : "Wrong username password combination"});
  //       });
  //     }
  //     else{
  //       res.send({message : "User doesnt exist"});
  //     }
  //   }
  // );

});

app.listen(3001, () => {
  console.log("running server");
});

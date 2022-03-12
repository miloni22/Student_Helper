import React, { useEffect, useState } from "react";
import Axios from 'axios';
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Registration() {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
      fname: "MiloniTest",
      lname:"MILONITEST",
    }).then((response) => {
      console.log(response);
    });
  };

  
  let navigate = useNavigate();

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if(response.data.message){
        setLoginStatus(response.data.message)
      }
      else{
        navigate("/dashboard");
        setLoginStatus(response.data[0].first_name)
      }
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      console.log(response);  
    if (response.data.loggedIn == true) {
        navigate("/dashboard");
        setLoginStatus(response.data.user[0].first_name);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => {
            setUsernameReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPasswordReg(e.target.value);
          }}
        />
        <button onClick={register}> Register </button>
      </div>

      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={login}> Login </button>
      </div>

      {/* <h1>{loginStatus}</h1> */}
    </div>
  );
}

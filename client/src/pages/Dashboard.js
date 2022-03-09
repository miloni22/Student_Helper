import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";



function Dashboard() {



    let navigate = useNavigate();
    let { username } = useParams();

    
  const [loginStatus, setLoginStatus] = useState("");

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
          console.log(response);  
        if (response.data.loggedIn === true) {
            console.log(response);
            setLoginStatus(response.data.user[0].first_name);
        }
        else{
          navigate("/registration");
        }
        });
    }, []);

  return (
    <div>
        <h1>This is the dashboard for {loginStatus}</h1>
      {/* THIS IS THE dashboard PAGE FOR {username}! */}
    </div>
  );
}

export default Dashboard;
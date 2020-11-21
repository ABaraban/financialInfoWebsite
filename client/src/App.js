import './App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';

function App() {
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const login = ()=>{
    console.log("helloclient");
    Axios.post('http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3456/api/login', {
      username:username,
      password:password,
    }).then(()=>{
      alert("Successful login");
    });
  };
  Axios.get('http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3456/expressbackend');
  return (
    <div className="App">
      <h1>Login</h1>
      Username:<input onChange={(event)=>{
        setUsername(event.target.value);
      }} type="text"></input>
      Password:<input type="password" onChange={(event)=>{
      
        setPassword(event.target.value);
      }}></input>
      <button type="submit" onClick={login}>Login</button>
    </div>
  );
}

export default App;

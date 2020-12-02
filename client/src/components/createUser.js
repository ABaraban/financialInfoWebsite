import React, {useState, Component} from "react";
import Axios from 'axios';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
export default class createUser extends Component{
    constructor(props){
        super(props);
        this.state={username: "", password: ""}
    }
    componentDidMount(){
        ReactDOM.render("",
        document.getElementById("metrics"));
        ReactDOM.render("",
        document.getElementById("graph"));
    }
    submit = ()=>{
        Axios.post('http://localhost:3456/createUser', {
            username:this.state.username,
            password:this.state.password,
        })
        .then(function(response){
            if(response.data=="success"){
                alert("User Created");
                window.location.href="http://localhost:3000/login"
            }
            else{
                alert("User not created. Likely a duplicate username. Please try again.");
            }
        });
    };
    onChangeUsername = (e)=>{
        this.setState({
            username: e.target.value
        })
    };
    onChangePassword = (e)=>{
        this.setState({
            password: e.target.value
        })
    };
    render(){
       
        return(
        <div className="App">
          <h1>Create User</h1>
            Username:<input onChange={this.onChangeUsername} type="text" value={this.state.username}></input>
            Password:<input type="password" onChange={this.onChangePassword} value={this.state.password}></input>
            <button type="submit" onClick={this.submit}>Create User</button>
        </div>
        )   
    }
}

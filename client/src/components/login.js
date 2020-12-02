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
export default class login extends Component{
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
        //username=this.state.username;
        let propState= this.props;
        Axios.post('http://localhost:3456/login', {
            username:this.state.username,
            password:this.state.password,
        })
        .then(function(response){
            if(response.data=="success"){
                alert("Logged in");
            }
            else if(response.data=="wronguser"){
                window.location.href="http://localhost:3000/login";
                alert("That username does not exist. Please create a user or try again.");
            }
            else if(response.data=="wrongpass"){
                window.location.href="http://localhost:3000/login";
                alert("Wrong password. Please try again");
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
          <h1>Login</h1>
            Username:<input onChange={this.onChangeUsername} type="text" value={this.state.username}></input>
            Password:<input type="password" onChange={this.onChangePassword} value={this.state.password}></input>
            <Link
            to={{
                pathname:"/home",
                state:this.state.username,
             }}
             onClick={this.submit} className="button" >
            Login
            </Link>
            <br></br>
            <form action="http://localhost:3000/createUser">
                <button type="submit">Create User</button>
            </form>
        </div>
        )   
    }
}
  

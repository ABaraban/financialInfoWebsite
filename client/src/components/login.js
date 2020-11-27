import React, {useState, Component} from "react";
import Axios from 'axios';
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
                //window.location.href="http://localhost:3000/home"
                // propState.Router.push({
                //     pathname: '/home',
                //     state: {
                //       id: 7,
                //       color: 'green'
                //     }
                //   })
            }
            else if(response.data=="wronguser"){
                alert("That username does not exist. Please create a user or try again.");
            }
            else if(response.data=="wrongpass"){
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
                state:this.state.username
             }} >
            <button type="submit" onClick={()=>{
                this.submit();
            }}>Login</button>
            </Link>
            <br></br>
            <form action="http://localhost:3000/createUser">
                <button type="submit">Create User</button>
            </form>
        </div>
        )   
    }
}
  

import React, {useState, Component} from "react";
import Axios from 'axios';
export default class login extends Component{
    constructor(props){
        super(props);
        this.state={username: "", password: ""}
    }
    submit = ()=>{
        console.log("helloclient");
        Axios.post('http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3456/api/login', {
            username:this.state.username,
            password:this.state.password,
        }).then(()=>{
        alert("Successful login");
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
          <form method="POST" action='http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3456/api/login'>
            Username:<input onChange={this.onChangeUsername} type="text" value={this.state.username}></input>
            Password:<input type="password" onChange={this.onChangePassword} value={this.state.password}></input>
            <button type="submit" onClick={this.submit}>Login</button>
          </form>
        </div>
        )   
    }
}
  

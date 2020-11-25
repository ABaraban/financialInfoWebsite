import React, {useState, Component} from "react";
import Axios from 'axios';
export default class login extends Component{
    constructor(props){
        super(props);
        this.state={username: "", password: ""}
    }
    submit = ()=>{
        //username=this.state.username;
        Axios.post('http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3456/login', {
            username:this.state.username,
            password:this.state.password,
        })
        .then(function(response){
            if(response.data=="success"){
                alert("Logged in");
                // let data=[state.username];
                // props.history.push({
                //     pathname: 'http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3000/home',
                //     data: data // your data array of objects
                //   })
                window.location.href="http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3000/home"
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
            <button type="submit" onClick={this.submit}>Login</button>
            <br></br>
            <form action="http://ec2-52-14-184-36.us-east-2.compute.amazonaws.com:3000/createUser">
                <button type="submit">Create User</button>
            </form>
            
        </div>
        )   
    }
}
  

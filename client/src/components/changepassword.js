import Axios from "axios";
import React, {useState, Component} from "react";
import ReactDOM from 'react-dom';
export default class ChangePass extends Component{
    constructor(props){
        super(props);
        this.state={newpass: "", verifynewpass: ""}
    }
    componentDidMount(){
        ReactDOM.render("",
        document.getElementById("metrics"));
        ReactDOM.render("",
        document.getElementById("graph"));
    }
    newPassChange=(e)=>{
        this.setState({
            newpass: e.target.value
        })
    }
    verifyNewPassChange=(e)=>{
        this.setState({
            verifynewpass: e.target.value
        })
    }
    submitPassChange=()=>{
        console.log(this.props);
        //console.log(this.props.location.state)
        if(this.state.newpass!=this.state.verifynewpass){
            alert("Passwords don't match");
            return;
        }
        Axios.post('http://localhost:3456/changepass',{
            newpass:this.state.newpass,
            user:this.props.location.state
        })
        .then(function(response){
            if(response.data=="success"){
                alert("Password changed");
            }
            else if(response.data=="failure"){
                alert("Password not changed");
            }
        });
    }
    render(){
        
        return(
        <div className="App">
          <h1>Change Password</h1>
          New Password:<input type="password" onChange={this.newPassChange}></input>
          <br></br>
          Verify New Password:<input type="password" onChange={this.verifyNewPassChange}></input>
          <br></br>
          <button onClick={this.submitPassChange}>Change Password</button>
        </div>
        )   
    }
}
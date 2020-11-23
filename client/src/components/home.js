import React, {useState, Component} from "react";
import Axios from 'axios';
import login from './login'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
export default class home extends Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state={ticker:"", password: ""}
    }
    render(){
       
        return(
        <div className="App">
          <h1>Your Portfolio</h1>
            Ticker:<input onChange={this.onChangeUsername} type="text" value={this.state.username}></input>
            <button type="submit" onClick={this.submit}>Search</button>
        </div>
        )   
    }
}

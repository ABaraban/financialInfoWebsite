import React, {useState, Component} from "react";
import ReactDOM from 'react-dom';
import login from './login';
import CreatePlotlyComponent from 'react-plotly.js/factory';
import Plot from 'react-plotly.js';
import Axios from 'axios';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
  class Graph extends Component {
    constructor(props){
      super(props);
      console.log(props.data);
    }
    render(){
      return(
        <Plot
        data={this.props.data}
        layout={{ 
          title: 'Time Series with Rangeslider',
          xaxis: {
            autorange: true,
            range: ['2015-02-17', '2017-02-16'],
            rangeselector: {buttons: [
                {
                  count: 1,
                  label: '1m',
                  step: 'month',
                  stepmode: 'backward'
                },
                {
                  count: 6,
                  label: '6m',
                  step: 'month',
                  stepmode: 'backward'
                },
                {step: 'all'}
              ]},
            rangeslider: {range: [this.props.data[0].x[0], this.props.data[0].x[this.props.data[0].x.length-1]]},
            type: 'date'
          },
          yaxis: {
            autorange: true,
            range: [86.8700008333, 138.870004167],
            type: 'linear'
          }
        }
        }
      />
      );
    }
      
    
  }
export default class home extends Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          ticker:"",
          email:"",
        }
    }
    onChangeTicker = (e)=>{
        this.setState({
            ticker: e.target.value
        })
    };
    onChangeEmail = (e)=>{
      this.setState({
          email: e.target.value
      })
  };
    
    displayGraph= (e)=>{
      console.log(e.target.id);
      let rows;
      let url='https://sandbox.iexapis.com/stable/stock/'+e.target.id+'/chart/5y?token=Tpk_57e77d563cb543d6971bd4f479ad64e9';
      fetch(url,{
        method: "GET"
      })
      .then(res=>res.json())
      .then(response=>{
        console.log(response);
        rows=response;
        function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
        }
        var trace1 = {
          type: "scatter",
          mode: "lines",
          name: e.target.id+ ' High',
          x: unpack(rows, 'date'),
          y: unpack(rows, 'uHigh'),
          line: {color: '#17BECF'}
        }
  
        var trace2 = {
          type: "scatter",
          mode: "lines",
          name: e.target.id+' Low',
          x: unpack(rows, 'date'),
          y: unpack(rows, 'uLow'),
          line: {color: '#7F7F7F'}
        }
        var data = [trace1,trace2];
        
        console.log("clicked");
        ReactDOM.render(
          <Graph data ={data}/>,
          document.getElementById('graph')
        );
      })
      
    }
    submit = ()=>{
      let status=true;
      let url ='https://sandbox.iexapis.com/stable/stock/'+this.state.ticker+'/quote?token=Tpk_57e77d563cb543d6971bd4f479ad64e9';
      fetch(url,{
        method: "GET"
      })
      .then(res=>{
        console.log(res);
        if(res.status==404){
          alert("Invalid Ticker. Try again");
          status=false;
        }
        else{
          return res.json()
        }
      })
      .then(response=>{
        console.log(response);
        // let price=React.createElement("p", null, 'Price:' +response.iexRealtimePrice);
        // let name=React.createElement("h3", null, response.companyName);
        let metrics=React.createElement("div",{
          id:response.symbol,
          onClick:this.displayGraph,
        }, response.companyName+ " Price: " +response.latestPrice)
        ReactDOM.render(metrics, document.getElementById("metrics"));
      })
    };
    email = ()=>{
      Axios.post('http://localhost:3456/email', {
            email:this.state.email,
            url:window.location.href
        })
        .then(function(response){
          console.log(response);
          if(response.data=="success"){
            alert("Email sent. Cannot guarantee it was received if the email address was incorrect.");
          }
          else if(response.data=="invalid email"){
            alert("Invalid Email Address");
          }
          else{
            alert("Error sending email");
          }
        });
    };
    render(){
       
        return(
        <div className="App">
          <h1>Your Portfolio</h1>
            Ticker:<input onChange={this.onChangeTicker} type="text" value={this.state.ticker}></input>
            <button type="submit" onClick={this.submit}>Search</button>
            <br></br>
            Email:<input onChange={this.onChangeEmail} type="text" value={this.state.email}></input>
            <button type="submit" onClick={this.email}>Invite A New User</button>
        </div>
        )   
    }
}


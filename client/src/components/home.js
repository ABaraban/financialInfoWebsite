import React, {useState, Component} from "react";
import ReactDOM from 'react-dom';
import login from './login';
import CreatePlotlyComponent from 'react-plotly.js/factory';
import Plot from 'react-plotly.js';
import Axios from 'axios';
import {std} from 'mathjs';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
  //The idea for this graph came from FILL IN LINK HERE
  class Graph extends Component {
    constructor(props){
      super(props);
      console.log(props);
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
        console.log(props.location.state);
        this.state={
          ticker:"",
          email:"",
          favorites:[],
        }
        
    }
    componentDidMount=()=>{
      if(this.props.location.state==""){
        window.location.href="http://localhost:3000/login"
      }
      console.log("LOADED");
      Axios.post("http://localhost:3456/loadfavorites",{
        user:this.props.location.state
      })
      .then(res=>{
        console.log(res);
        let favs=[];
        for(let i=0; i<res.data.length;++i){
            let url ='https://sandbox.iexapis.com/stable/stock/'+res.data[i].ticker+'/quote?token=Tpk_57e77d563cb543d6971bd4f479ad64e9';
            fetch(url,{
              method: "GET"
            })
            .then(res=>res.json())
            .then(response=>{
              console.log(response);
              let avg=0;
              let sum=0;
              let devarr=[];
              let urlnew='https://sandbox.iexapis.com/stable/stock/'+response.symbol+'/chart/1y?token=Tpk_96d9d438d78b4a3fbc67ab52de7ac67e';
              fetch(urlnew,{
                method: "GET"
              })
              .then(res=>res.json())
              .then(resp=>{
                console.log(resp);
                for(let i=0; i<resp.length;++i){
                  sum+=(resp[i].high+resp[i].low)/2.000000;
                  devarr.push((resp[i].high+resp[i].low)/2.000000);
                }
                avg=sum/(resp.length-1);
                console.log(devarr);
                if(devarr.length>25){
                  favs.push(<span id={response.symbol} onClick={this.displayGraph}>{response.companyName+" Price: "+response.latestPrice+" 1Y Avg. Price : $"+Math.round(avg)+"  1Y Std. Dev.: $"+Math.round(std(devarr))}</span>);
                  favs.push(<br></br>);
                  this.setState({
                    favorites:favs
                  });
                }
                else{
                  alert("Not enough data to display avg price or std dev");
                  favs.push(<span id={response.symbol} onClick={this.displayGraph}>{response.companyName+" Price: "+response.latestPrice}</span>);
                  favs.push(<br></br>);
                  this.setState({
                    favorites:favs
                  });
                }
              })
            });
        }
        
      })
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
      let url='https://sandbox.iexapis.com/stable/stock/'+e.target.id+'/chart/5y?token=Tpk_96d9d438d78b4a3fbc67ab52de7ac67e';
      fetch(url,{
        method: "GET"
      })
      .then(res=>res.json())
      .then(response=>{
        console.log(response);
        if(response.length<=25){
          alert("There is not enough data for that ticker to display a graph. Sorry.")
        }
        else{
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
        }
        
      })
      
    }
    addFavorite = (e)=>{
      console.log(this.props.location.state);
      console.log(e.target.className);
      Axios.post('http://localhost:3456/addfav', {
            user:this.props.location.state,
            ticker:e.target.className
        })
        .then(function(response){
          if(response.data=="success"){
            alert(e.target.className+" is now one of your favorite stocks!");
          }
          else{
            alert("Not added. Likely a duplicate.");
          }
          console.log(response);
        });
        this.componentDidMount();
    }
    submit = ()=>{
      let status=true;
      let url ='https://sandbox.iexapis.com/stable/stock/'+this.state.ticker+'/quote?token=Tpk_96d9d438d78b4a3fbc67ab52de7ac67e';
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
        let avg=0;
        let sum=0;
        let devarr=[];
        let urlnew='https://sandbox.iexapis.com/stable/stock/'+response.symbol+'/chart/1y?token=Tpk_57e77d563cb543d6971bd4f479ad64e9';
        fetch(urlnew,{
          method: "GET"
        })
        .then(res=>res.json())
        .then(resp=>{
          for(let i=0; i<resp.length;++i){
            sum+=(resp[i].high+resp[i].low)/2.000000;
            devarr.push((resp[i].high+resp[i].low)/2.000000);
          }
          avg=sum/(resp.length-1);
          console.log(devarr);
          let metrics;
          if(devarr.length<25){
            alert("Not enough data to display avg price or std dev");
            metrics=React.createElement("div",{
            }, React.createElement("span",{
              id:response.symbol,
              onClick:this.displayGraph,
            },response.companyName+" Current Price: $" +response.latestPrice),
            React.createElement("button",{
              className:response.symbol,
              onClick:this.addFavorite,
            }, "Add favorite"))
          }
          else{
            metrics=React.createElement("div",{
            }, React.createElement("span",{
              id:response.symbol,
              onClick:this.displayGraph,
            },response.companyName+" Current Price: $" +response.latestPrice+" 1Y Avg. Price : $"+Math.round(avg)+"  1Y Std. Dev.: $"+Math.round(std(devarr))),
            React.createElement("button",{
              className:response.symbol,
              onClick:this.addFavorite,
            }, "Add favorite"))
          }
          ReactDOM.render(metrics, document.getElementById("metrics"));
        })
        
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
    logout=()=>{
      window.location.href="http://localhost:3000/login";
      this.props.location.state=undefined;
    }
    render(){
       
        return(
        <div className="App">
          <h1>Your Portfolio</h1>
          <button onClick={this.logout}>Logout</button>
          <Link
          to={{
            pathname:"/changepassword",
            state:this.props.location.state
         }}className="button">
          Change Password
          </Link>
          
          <h3>Invite a New User</h3>
          Email:<input onChange={this.onChangeEmail} type="text" value={this.state.email}></input>
            <button type="submit" onClick={this.email}>Invite A New User</button>
            <br></br>
          <h3>Favorites</h3>
          {
              this.state.favorites.map((fav, index)=>(
                fav
              ))}
              <h3>Search</h3>
            Ticker:<input onChange={this.onChangeTicker} type="text" value={this.state.ticker}></input>
            <button type="submit" onClick={this.submit}>Search</button>
            <h4>Click on a ticker to display its 5 year graph.</h4>
        </div>
        )   
    }
}


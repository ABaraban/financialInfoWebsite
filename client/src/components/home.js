import React, {useState, Component} from "react";
import ReactDOM from 'react-dom';
import login from './login';
import Plot from 'react-plotly.js';
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
        this.state={ticker:""}
    }
    onChangeTicker = (e)=>{
        this.setState({
            ticker: e.target.value
        })
    };
    displayGraph= (e)=>{
      // console.log(e.target.id);
      // let url='https://sandbox.iexapis.com/stable/stock/'+e.target.id+'/chart/5y?token=Tpk_57e77d563cb543d6971bd4f479ad64e9';
      // fetch(url,{
      //   method: "GET"
      // })
      // .then(res=>res.json())
      // .then(response=>{
      //   console.log(response);
      // })
    }
    submit = ()=>{
      let status=true;
      let url ='https://sandbox.iexapis.com/stable/stock/'+this.state.ticker+'/quote?token=Tpk_57e77d563cb543d6971bd4f479ad64e9';
      fetch(url,{
        method: "GET"
      })
      .then(res=>{
        //console.log(res);
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
        }, response.companyName+ " Price: " +response.iexRealtimePrice)
        ReactDOM.render(metrics, document.getElementById("metrics"));
      })
    };
    render(){
       
        return(
        <div className="App">
          <h1>Your Portfolio</h1>
            Ticker:<input onChange={this.onChangeTicker} type="text" value={this.state.ticker}></input>
            <button type="submit" onClick={this.submit}>Search</button>
            <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
        />
        </div>
        )   
    }
}

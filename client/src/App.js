import './App.css';
import React, {useState} from "react";
import Axios from 'axios';
import login from './components/login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Route exact path="/homepage" component={login}></Route>
    </Router>
    
  );
}

export default App;

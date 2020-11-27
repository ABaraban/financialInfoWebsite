import './App.css';
import React, {useState} from "react";
import login from './components/login'
import createUser from './components/createUser'
import home from './components/home'
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
      <Route exact path="/createUser" component={createUser}></Route>
      <Route exact path="/home" component={home}></Route>
      <Route exact path="/login" component={login}></Route>
    </Router>
    
  );
}

export default App;

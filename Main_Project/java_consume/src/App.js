import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import PeopleList from "./components/people-list.component";
//import EditPerson from "./components/edit-person.component";
//import CreatePerson from "./components/create-person.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="nav-link">Consumption</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">People</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Person</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br />
          <Route path="/" exact component={PeopleList} />
          
        </div>
      </Router>
    );
  }
}

/*
<Route path="/edit/:id" component={EditPerson} />
          <Route path="/create" component={CreatePerson} />*/

export default App;

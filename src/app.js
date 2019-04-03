import React, {Component} from 'react';
import {Route, BrowserRouter as Router} from 'react-router-dom'
import NavBar from './components/nav';
import NavBarMobile from './components/nav-mobile';
import {About, Blog, Contact, Home, Work, Projects} from './components/index';

export default class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="router-wrapper">
        <Router>
          <NavBar/>
          <NavBarMobile/>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/about" component={About}></Route>
          <Route exact path="/work" component={Work}></Route>
          <Route exact path="/projects" component={Projects}></Route>
          <Route exact path="/blog" component={Blog}></Route>
          <Route exact path="/contact" component={Contact}></Route>
        </Router>
      </div>
    )
  }
}
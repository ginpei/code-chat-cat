import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import { createBrowserHistory } from 'history';

class App extends Component {
  protected appHistory = createBrowserHistory();
  
  render() {
    return (
      <Router history={this.appHistory}>
        <div className="App">
          <Switch>
            <Route exact={true} path="/" component={HomePage}/>
            <Route exact={true} path="/login" component={LoginPage}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

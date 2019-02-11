import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { createStore } from 'redux';

class App extends Component {
  protected store = createStore(rootReducer);
  protected appHistory = createBrowserHistory();
  
  render() {
    return (
      <Provider store={this.store}>
        <Router history={this.appHistory}>
          <div className="App">
            <Switch>
              <Route exact={true} path="/" component={HomePage}/>
              <Route exact={true} path="/login" component={LoginPage}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

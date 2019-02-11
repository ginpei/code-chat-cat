import { createBrowserHistory } from 'history';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import { createStore } from 'redux';
import rootReducer from './reducers';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';

class App extends Component {
  protected store = createStore(rootReducer);
  protected appHistory = createBrowserHistory();

  public render () {
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

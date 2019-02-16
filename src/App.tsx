import { createBrowserHistory } from 'history';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import { createStore } from 'redux';
import * as currentUser from './currentUser';
import rootReducer from './reducers';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RoomTextbookPage from './screens/RoomTextbookPage';

// tslint:disable-next-line:no-empty-interface
interface IAppProps {
}
interface IAppState {
  ready: boolean;
}

class App extends Component<IAppProps, IAppState> {
  protected store = createStore(rootReducer);
  protected appHistory = createBrowserHistory();

  constructor (props: IAppProps) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  public render () {
    if (!this.state.ready) {
      return (
        <div>...</div>
      );
    }

    return (
      <Provider store={this.store}>
        <Router history={this.appHistory}>
          <div className="App">
            <Switch>
              <Route exact={true} path="/" component={HomePage}/>
              <Route exact={true} path="/login" component={LoginPage}/>
              <Route exact={true} path="/rooms/:id/" component={RoomTextbookPage}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }

  public async componentDidMount () {
    await currentUser.initialize(this.store);
    this.setState({
      ready: true,
    });
  }
}

export default App;

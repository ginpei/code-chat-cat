import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import { createStore } from 'redux';
import { appHistory } from './misc';
import * as currentUser from './models/currentUser';
import rootReducer from './reducers';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import LogoutPage from './screens/LogoutPage';
import RoomTextbookPage from './screens/RoomTextbookPage';
import RoomWritePage from './screens/RoomWritePage';

// tslint:disable-next-line:no-empty-interface
interface IAppProps {
}
interface IAppState {
  ready: boolean;
}

class App extends Component<IAppProps, IAppState> {
  protected store = createStore(rootReducer);

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
        <Router history={appHistory}>
          <div className="App">
            <Switch>
              <Route exact={true} path="/" component={HomePage}/>
              <Route exact={true} path="/login" component={LoginPage}/>
              <Route exact={true} path="/logout" component={LogoutPage}/>
              <Route exact={true} path="/rooms/:id/" component={RoomTextbookPage}/>
              <Route exact={true} path="/rooms/:id/write" component={RoomWritePage}/>
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

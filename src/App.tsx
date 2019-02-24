import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import { createStore } from 'redux';
import LoadingView from './components/LoadingView';
import { appHistory } from './misc';
import { connectUserRooms2 } from './models/rooms';
import * as users from './models/users';
import rootReducer, { Action, IState } from './reducers';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import LogoutPage from './screens/LogoutPage';
import NotFoundPage from './screens/NotFoundPage';
import RoomListPage from './screens/RoomListPage';
import RoomNewPage from './screens/RoomNewPage';
import RoomSettingsPage from './screens/RoomSettingsPage';
import RoomTextbookPage from './screens/RoomTextbookPage';
import RoomWritePage from './screens/RoomWritePage';
import SettingsPage from './screens/SettingsPage';

// tslint:disable:no-empty-interface
interface IAppProps {
}
interface IAppState {
  ready: boolean;
}

class App extends Component<IAppProps, IAppState> {
  protected store = createStore<IState, Action, {}, {}>(rootReducer);
  protected unsubscribe: (() => void) | null = null;
  protected unsubscribeUserRooms: () => void;

  constructor (props: IAppProps) {
    super(props);
    this.state = {
      ready: false,
    };
    this.unsubscribeUserRooms = () => undefined;
  }

  public render () {
    if (!this.state.ready) {
      return (
        <LoadingView/>
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
              <Route exact={true} path="/rooms/" component={RoomListPage}/>
              <Route exact={true} path="/rooms/new" component={RoomNewPage}/>
              <Route exact={true} path="/rooms/:id/" component={RoomTextbookPage}/>
              <Route exact={true} path="/rooms/:id/write" component={RoomWritePage}/>
              <Route exact={true} path="/rooms/:id/settings" component={RoomSettingsPage}/>
              <Route exact={true} path="/settings" component={SettingsPage}/>
              <Route component={NotFoundPage}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }

  public async componentDidMount () {
    const { store } = this;
    this.unsubscribe = await users.initializeCurrentUser(store);
    this.unsubscribeUserRooms = await connectUserRooms2(store);

    const un = store.subscribe(() => {
      const userReady = store.getState().currentUser.ready;
      const roomReady = store.getState().rooms.ready;
      if (userReady && roomReady) {
        this.setState({ ready: true });
        un();
      }
    });
  }

  public componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.unsubscribeUserRooms();
  }
}

export default App;

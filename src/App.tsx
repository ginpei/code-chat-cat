import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import LoadingView from './independents/LoadingView';
import { appHistory, noop, store } from './misc';
import * as CurrentUser from './models/CurrentUser';
import * as Profiles from './models/Profiles';
import * as Rooms from './models/Rooms';
import { connectUserRooms } from './models/rooms0';
import * as users from './models/users';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import LogoutPage from './screens/LogoutPage';
import NotFoundPage from './screens/NotFoundPage';
import PrivacyPage from './screens/PrivacyPage';
import RoomListPage from './screens/RoomListPage';
import RoomNewPage from './screens/RoomNewPage';
import RoomSettingsPage from './screens/RoomSettingsPage';
import RoomTextbookPage from './screens/RoomTextbookPage';
import RoomWritePage from './screens/RoomWritePage';
import SettingsPage from './screens/SettingsPage';
import TermsPage from './screens/TermsPage';

// tslint:disable:no-empty-interface
interface IAppProps {
}
interface IAppState {
  ready: boolean;
}

class App extends Component<IAppProps, IAppState> {
  protected unsubscribeAuth = noop;
  protected unsubscribeProfile = noop;
  protected unsubscribeUserRooms = noop;
  protected unsubscribeCurrentUser0: () => void;
  protected unsubscribeUserRooms0: () => void;

  constructor (props: IAppProps) {
    super(props);
    this.state = {
      ready: false,
    };
    this.unsubscribeCurrentUser0 = () => undefined;
    this.unsubscribeUserRooms0 = () => undefined;
  }

  public render () {
    if (!this.state.ready) {
      return (
        <LoadingView/>
      );
    }

    return (
      <Provider store={store}>
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
              <Route exact={true} path="/terms" component={TermsPage}/>
              <Route exact={true} path="/privacy" component={PrivacyPage}/>
              <Route component={NotFoundPage}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }

  public async componentDidMount () {
    this.connectCurrentUser();

    this.unsubscribeCurrentUser0 = await users.initializeCurrentUser(store);
    this.unsubscribeUserRooms0 = await connectUserRooms(store);

    const un = store.subscribe(() => {
      const userReady = store.getState().currentUser0.ready;
      const roomReady = store.getState().rooms.ready;
      if (userReady && roomReady) {
        this.setState({ ready: true });
        un();
      }
    });
  }

  public componentWillUnmount () {
    this.disconnectCurrentUser();
    this.unsubscribeCurrentUser0();
    this.unsubscribeUserRooms0();
  }

  private connectCurrentUser () {
    this.disconnectCurrentUser();
    this.unsubscribeAuth = CurrentUser.connectAuth(
      (user) => {
        if (!user) {
          return;
        }
        this.unsubscribeProfile = this.connectProfile(user);
        this.unsubscribeUserRooms = this.connectUserRooms(user);
      },
      (error) => console.log('# auth error', error), // TODO
    );
  }

  private disconnectCurrentUser () {
    this.unsubscribeUserRooms();
    this.unsubscribeProfile();
    this.unsubscribeAuth();
  }

  private connectProfile (user: firebase.User) {
    store.dispatch(CurrentUser.set(user));
    const unsubscribeProfile = Profiles.connectProfile(
      user ? user.uid : '',
      (profile) => store.dispatch(CurrentUser.setProfile(profile)),
      (error) => {
        console.log('# profile error', error);
      },
    );
    return unsubscribeProfile;
  }

  private connectUserRooms (user: firebase.User) {
    const unsubscribe = Rooms.connectUserRooms(
      user.uid,
      (rooms) => console.log('# rooms', rooms),
      (error) => console.log('# error', error),
    );
    return unsubscribe;
  }
}

export default App;

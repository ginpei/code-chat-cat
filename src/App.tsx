import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import LoadingView from './independents/LoadingView';
import { appHistory, noop } from './misc';
import * as CurrentUser from './models/CurrentUser';
import * as ErrorLogs from './models/ErrorLogs';
import * as Profiles from './models/Profiles';
import { createAppStore } from './models/Store';
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
  protected store = createAppStore();

  constructor (props: IAppProps) {
    super(props);
    this.state = {
      ready: false,
    };
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
              <Route exact={true} path="/terms" component={TermsPage}/>
              <Route exact={true} path="/privacy" component={PrivacyPage}/>
              <Route component={NotFoundPage}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }

  public componentDidMount () {
    this.connectCurrentUser();
  }

  public componentWillUnmount () {
    this.disconnectCurrentUser();
  }

  private connectCurrentUser () {
    this.disconnectCurrentUser();
    this.unsubscribeAuth = CurrentUser.connectAuth(
      (user) => {
        if (!user) {
          return;
        }
        this.unsubscribeProfile = this.connectProfile(user);
      },
      (error) => this.saveError('auth error', error),
      () => this.setState({ ready: true }),
    );
  }

  private disconnectCurrentUser () {
    this.unsubscribeProfile();
    this.unsubscribeAuth();
  }

  private connectProfile (user: firebase.User) {
    this.store.dispatch(CurrentUser.set(user));
    const unsubscribeProfile = Profiles.connectProfile(
      user ? user.uid : '',
      (profile) => this.store.dispatch(CurrentUser.setProfile(profile)),
      (error) => this.saveError('connect profile', error),
    );
    return unsubscribeProfile;
  }

  private saveError (location: string, error: ErrorLogs.AppError) {
    this.store.dispatch(ErrorLogs.add(location, error));
  }
}

export default App;

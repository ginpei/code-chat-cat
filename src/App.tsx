import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import LoadingView from './independents/LoadingView';
import { appHistory, noop, resetTitle } from './misc';
import * as CurrentUser from './models/CurrentUser';
import * as ErrorLogs from './models/ErrorLogs';
import * as Profiles from './models/Profiles';
import { AppStore, createAppStore } from './models/Store';
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

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [store] = useState(createAppStore());
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => appHistory.listen(() => resetTitle()), []);

  // user
  useEffect(() => CurrentUser.connectAuth(
    (currentUser) => {
      setUser(currentUser);
      setReady(true);
    },
    (error) => {
      saveError(store, 'auth error', error);
      setReady(true);
    },
  ), [store]);

  // profile
  useEffect(() => {
    store.dispatch(CurrentUser.set(user));

    if (!user) {
      return noop;
    }

    return Profiles.connectProfile(
      user ? user.uid : '',
      (profile) => store.dispatch(CurrentUser.setProfile(profile)),
      (error) => saveError(store, 'connect profile', error),
    );
  }, [store, user]);

  if (!ready) {
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
};

function saveError (store: AppStore, location: string, error: ErrorLogs.AppError) {
  store.dispatch(ErrorLogs.add(location, error));
}

export default App;

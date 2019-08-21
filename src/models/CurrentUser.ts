import firebase from '../middleware/firebase';
import { noop } from '../misc';
import * as Profiles from './Profiles';

// ----------------------------------------------------------------------------
// states

export interface CurrentUserState {
  firebaseUser: firebase.User | null;
  id: string;
  loggedIn: boolean;
  name: string;
  profile: Profiles.Profile | null;
  ready: boolean;
}

const initialState: CurrentUserState = {
  firebaseUser: null,
  id: '',
  loggedIn: false,
  name: '',
  profile: null,
  ready: false,
};

// ----------------------------------------------------------------------------
// actions

interface SetCurrentUserAction {
  user: firebase.User | null;
  type: 'CURRENT_USER_SET';
}

export function set (user: firebase.User | null): SetCurrentUserAction {
  return {
    type: 'CURRENT_USER_SET',
    user,
  };
}

function setCurrentUser (user: firebase.User | null): CurrentUserState {
  if (!user) {
    return {
      ...initialState,
      ready: true,
    };
  }

  return {
    firebaseUser: user,
    id: user.uid,
    loggedIn: true,
    name: '',
    profile: null,
    ready: true,
  };
}

interface SetCurrentUserProfileAction {
  profile: Profiles.Profile;
  type: 'CURRENT_USER_SET_PROFILE';
}

export function setProfile (profile: Profiles.Profile): SetCurrentUserProfileAction {
  return {
    profile,
    type: 'CURRENT_USER_SET_PROFILE',
  };
}

export type CurrentUserAction =
  | SetCurrentUserAction
  | SetCurrentUserProfileAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceCurrentUser (
  state = initialState,
  action: CurrentUserAction,
): CurrentUserState {
  switch (action.type) {
    case 'CURRENT_USER_SET':
      return setCurrentUser(action.user);
    case 'CURRENT_USER_SET_PROFILE':
      return {
        ...state,
        name: action.profile.name,
        profile: action.profile,
      };
    default:
      return state;
  }
}

// ----------------------------------------------------------------------------
// connectors

export function connectAuth (
  nextOrObserver: (user: firebase.User | null) => void,
  onError: (error: firebase.auth.Error) => any = noop,
  onEach: firebase.Unsubscribe = noop,
): firebase.Unsubscribe {
  const unsubscribeAuth = firebase.auth().onAuthStateChanged(
    (user) => {
      nextOrObserver(user);
      onEach();
    },
    (error) => {
      onError(error);
      onEach();
    },
  );
  return unsubscribeAuth;
}

export function logOut () {
  return firebase.auth().signOut();
}

import firebase from '../middleware/firebase';
import { noop } from '../misc';
import * as Profiles from './Profiles';

// ----------------------------------------------------------------------------
// states

export interface ICurrentUserState {
  firebaseUser: firebase.User | null;
  id: string;
  loggedIn: boolean;
  name: string;
  profile: Profiles.IProfile | null;
  ready: boolean;
}

const initialState: ICurrentUserState = {
  firebaseUser: null,
  id: '',
  loggedIn: false,
  name: '',
  profile: null,
  ready: false,
};

// ----------------------------------------------------------------------------
// actions

interface ISetCurrentUserAction {
  user: firebase.User | null;
  type: 'CURRENT_USER_SET';
}

export function set (user: firebase.User | null): ISetCurrentUserAction {
  return {
    type: 'CURRENT_USER_SET',
    user,
  };
}

function setCurrentUser (user: firebase.User | null): ICurrentUserState {
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

interface ISetCurrentUserProfileAction {
  profile: Profiles.IProfile;
  type: 'CURRENT_USER_SET_PROFILE';
}

export function setProfile (profile: Profiles.IProfile): ISetCurrentUserProfileAction {
  return {
    profile,
    type: 'CURRENT_USER_SET_PROFILE',
  };
}

export type CurrentUserAction =
  | ISetCurrentUserAction
  | ISetCurrentUserProfileAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceCurrentUser (
  state = initialState,
  action: CurrentUserAction,
): ICurrentUserState {
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

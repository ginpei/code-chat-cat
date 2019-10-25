import firebase from '../middleware/firebase';
import { noop } from '../misc';
import * as Profiles from './Profiles';

export async function logInAsAnonymous(
  auth: firebase.auth.Auth,
  firestore: firebase.firestore.Firestore,
  profile: Omit<Profiles.Profile, 'id'>,
) {
  if (auth.currentUser) {
    throw new Error('User has already logged in');
  }

  const cred = await auth.signInAnonymously();
  const newProfile: Profiles.Profile = {
    ...profile,
    id: cred.user!.uid,
  };
  return newProfile;
}

export async function logOut2(auth: firebase.auth.Auth) {
  await auth.signOut();
}

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
  profile: Profiles.Profile | null;
  type: 'CURRENT_USER_SET_PROFILE';
}

export function setProfile (profile: Profiles.Profile | null): SetCurrentUserProfileAction {
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
        name: action.profile ? action.profile.name : '',
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

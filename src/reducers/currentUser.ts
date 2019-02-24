import firebase from '../middleware/firebase';
import { ClientRecord, IRecord } from '../misc';

export interface ICurrentUser {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  profile: IUserProfile | null;
  ready: boolean;
  uid: string;
  working: boolean;
}
const defaultCurrentUser: ICurrentUser = {
  firebaseUser: null,
  loggedIn: false,
  profile: null,
  ready: false,
  uid: '',
  working: false,
};

export interface IUserProfileRecord extends IRecord {
  id: string; // aka uid
  name: string;
}
export type IUserProfile = ClientRecord<IUserProfileRecord>;

export enum CurrentUserActionTypes {
  setFirebaseUser = 'currentUser/setFirebaseUser',
  setProfile = 'currentUser/setProfile',
  setReady = 'currentUser/setReady',
  setWorking = 'currentUser/setWorking',
}

export type CurrentUserAction =
  | ICurrentUserSetFirebaseUserAction
  | ICurrentUserSetProfileAction
  | ICurrentUserSetReadyAction
  | ICurrentUserSetWorkingAction;

// --------------------------
// set firebase user

interface ICurrentUserSetFirebaseUserAction {
  type: CurrentUserActionTypes.setFirebaseUser;
  user: firebase.User | null;
}
function setFirebaseUser (
  state: ICurrentUser,
  action: ICurrentUserSetFirebaseUserAction,
): ICurrentUser {
  const { user } = action;
  return {
    ...state,
    firebaseUser: user,
    loggedIn: Boolean(action.user),
    profile: null,
    uid: user ? user.uid : '',
  };
}

// --------------------------
// set user profile

interface ICurrentUserSetProfileAction {
  profile: IUserProfile | null;
  type: CurrentUserActionTypes.setProfile;
}
function setProfile (
  state: ICurrentUser,
  action: ICurrentUserSetProfileAction,
): ICurrentUser {
  const { profile } = action;
  return {
    ...state,
    profile,
  };
}

// --------------------------
// set ready

interface ICurrentUserSetReadyAction {
  type: CurrentUserActionTypes.setReady;
  ready: boolean;
}
function setReady (
  state: ICurrentUser,
  action: ICurrentUserSetReadyAction,
): ICurrentUser {
  return {
    ...state,
    ready: action.ready,
  };
}

// --------------------------
// set working

interface ICurrentUserSetWorkingAction {
  type: CurrentUserActionTypes.setWorking;
  working: boolean;
}
function setWorking (
  state: ICurrentUser,
  action: ICurrentUserSetWorkingAction,
) {
  return {
    ...state,
    working: action.working,
  };
}

// --------------------------
// Reducer

export default (
  state: ICurrentUser = defaultCurrentUser,
  action: CurrentUserAction,
) => {
  switch (action.type) {
    case CurrentUserActionTypes.setFirebaseUser:
      return setFirebaseUser(state, action);
    case CurrentUserActionTypes.setProfile:
      return setProfile(state, action);
    case CurrentUserActionTypes.setReady:
      return setReady(state, action);
    case CurrentUserActionTypes.setWorking:
      return setWorking(state, action);
    default:
      return state;
  }
};

import firebase from '../middleware/firebase';

export interface ICurrentUser {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  name: string;
  working: boolean;
}
const defaultCurrentUser: ICurrentUser = {
  firebaseUser: null,
  loggedIn: false,
  name: '',
  working: false,
};

export enum CurrentUserActionTypes {
  setUser = 'currentUser/setUser',
  setWorking = 'currentUser/setWorking',
}

type CurrentUserAction =
  ICurrentUserSetUserAction |
  ICurrentUserSetWorkingAction;

// --------------------------
// set user

interface ICurrentUserSetUserAction {
  type: CurrentUserActionTypes.setUser;
  user: firebase.User | null;
}
function setUser (state: ICurrentUser, action: ICurrentUserSetUserAction) {
  const { user } = action;
  return {
    ...state,
    firebaseUser: user,
    loggedIn: Boolean(action.user),
    name: user && (user.displayName || user.email) || '',
  };
}

// --------------------------
// set working

interface ICurrentUserSetWorkingAction {
  type: CurrentUserActionTypes.setWorking;
  working: boolean;
}
function setWorking (state: ICurrentUser, action: ICurrentUserSetWorkingAction) {
  return {
    ...state,
    working: action.working,
  };
}

// --------------------------
// Reducer

export default (state: ICurrentUser = defaultCurrentUser, action: CurrentUserAction) => {
  switch (action.type) {
    case CurrentUserActionTypes.setUser:
      return setUser(state, action);
    case CurrentUserActionTypes.setWorking:
      return setWorking(state, action);
    default:
      return state;
  }
};

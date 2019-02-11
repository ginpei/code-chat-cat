export interface ICurrentUser {
  name: string;
}
type CurrentUser = ICurrentUser | null;

export enum CurrentUserActionTypes {
  logIn = 'processing/logIn',
  logOut = 'processing/logOut',
}

interface ICurrentUserLogInAction {
  type: CurrentUserActionTypes.logIn;
}

interface ICurrentUserLogOutAction {
  type: CurrentUserActionTypes.logOut;
}

type ProcessingAction =
  ICurrentUserLogInAction |
  ICurrentUserLogOutAction;

export const logIn = (): ICurrentUserLogInAction => {
  return {
    type: CurrentUserActionTypes.logIn,
  };
};

export default (state: CurrentUser = null, action: ProcessingAction) => {
  switch (action.type) {
    case CurrentUserActionTypes.logIn:
      return { name: 'New user' };
    case CurrentUserActionTypes.logOut:
      return null;
    default:
      return state;
  }
};

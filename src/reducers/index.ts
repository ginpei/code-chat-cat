import { combineReducers } from 'redux';
import currentUser, { CurrentUserAction, ICurrentUser } from './currentUser';
import rooms, { IRoomState, RoomsAction } from './rooms';

export interface IState {
  currentUser: ICurrentUser;
  rooms: IRoomState;
}

export type Action = CurrentUserAction | RoomsAction;
export type Dispatch = (action: Action) => void;

export default combineReducers({
  currentUser,
  rooms,
});

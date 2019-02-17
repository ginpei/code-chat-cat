import { combineReducers } from 'redux';
import currentUser, { CurrentUserAction, ICurrentUser } from './currentUser';
import rooms, { IRooms, RoomsAction } from './rooms';

export interface IState {
  currentUser: ICurrentUser;
  rooms: IRooms;
}

export type Action = CurrentUserAction | RoomsAction;
export type Dispatch = (action: Action) => void;

export default combineReducers({
  currentUser,
  rooms,
});

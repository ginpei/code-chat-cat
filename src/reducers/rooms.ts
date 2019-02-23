import { ClientRecord, IRecord } from '../misc';

export interface IRoomRecord extends IRecord {
  active: boolean;
  name: string;
  textbookContent: string;
  userId: string;
}
export type IRoom = ClientRecord<IRoomRecord>;
export interface IRoomState {
  userRooms: IRoom[];
}
const defaultRooms: IRoomState = {
  userRooms: [],
};

export enum RoomsActionTypes {
  setUserRooms = 'rooms/setUserRooms',
}

export type RoomsAction = IRoomsSetUserRoomsAction;

// --------------------------
// set user's rooms

interface IRoomsSetUserRoomsAction {
  type: RoomsActionTypes.setUserRooms;
  rooms: IRoom[];
}
function setUserRooms (
  state: IRoomState,
  action: IRoomsSetUserRoomsAction,
): IRoomState {
  return {
    ...state,
    userRooms: action.rooms,
  };
}

// --------------------------
// Reducer

export default (state: IRoomState = defaultRooms, action: RoomsAction) => {
  switch (action.type) {
    case RoomsActionTypes.setUserRooms:
      return setUserRooms(state, action);
    default:
      return state;
  }
};

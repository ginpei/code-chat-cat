export interface IRoomRecord {
  active: boolean;
  name: string;
  textbookContent: string;
  userId: string;
}
export interface IRoom extends IRoomRecord {
  id: string;
}
export interface IRooms {
  rooms: IRoom[];
}
const defaultRooms: IRooms = {
  rooms: [],
};

export enum RoomsActionTypes {
  setRooms = 'rooms/setRooms',
}

export type RoomsAction =
  IRoomsSetRoomsAction;

// --------------------------
// set rooms
// maybe this is not needed?

interface IRoomsSetRoomsAction {
  type: RoomsActionTypes.setRooms;
  rooms: IRoom[];
}
function setRooms (state: IRooms, action: IRoomsSetRoomsAction) {
  return {
    ...state,
    rooms: action.rooms,
  };
}

// --------------------------
// Reducer

export default (state: IRooms = defaultRooms, action: RoomsAction) => {
  switch (action.type) {
    case RoomsActionTypes.setRooms:
      return setRooms(state, action);
    default:
      return state;
  }
};

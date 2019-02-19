export interface IRoom {
  name: string;
  id: string;
  textbookContent: string;
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

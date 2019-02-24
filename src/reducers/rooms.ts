import { ClientRecord, IRecord } from '../misc';
import { updateRoom } from '../models/rooms';

export interface IRoomRecord extends IRecord {
  active: boolean;
  name: string;
  textbookContent: string;
  userId: string;
}
export type IRoom = ClientRecord<IRoomRecord>;
export interface IRoomState {
  activeRooms: IRoom[];
  ready: boolean;
  userRooms: IRoom[];
}
const defaultRooms: IRoomState = {
  activeRooms: [],
  ready: false,
  userRooms: [],
};

// --------------------------
// actions

export enum RoomsActionTypes {
  setReady = 'rooms/setReady',
  setActiveRooms = 'rooms/setActiveRooms',
  setUserRooms = 'rooms/setUserRooms',
  saveRoom = 'rooms/saveRoom',
}

export type RoomsAction =
  | IRoomsSetReadyAction
  | IRoomsSetActiveRoomsAction
  | IRoomsSetUserRoomsAction
  | IRoomsSaveRoomAction;

// --------------------------
// set ready or not

interface IRoomsSetReadyAction {
  ready: boolean;
  type: RoomsActionTypes.setReady;
}
function setReady (
  state: IRoomState,
  action: IRoomsSetReadyAction,
): IRoomState {
  return {
    ...state,
    ready: action.ready,
  };
}

// --------------------------
// set currently active rooms

interface IRoomsSetActiveRoomsAction {
  type: RoomsActionTypes.setActiveRooms;
  rooms: IRoom[];
}
function setActiveRooms (
  state: IRoomState,
  action: IRoomsSetActiveRoomsAction,
): IRoomState {
  return {
    ...state,
    activeRooms: action.rooms,
  };
}

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
// save user's rooms

interface IRoomsSaveRoomAction {
  type: RoomsActionTypes.saveRoom;
  room: IRoom;
}
function saveRoom (
  state: IRoomState,
  action: IRoomsSaveRoomAction,
): IRoomState {
  const userRooms = [...state.userRooms];
  const { room } = action;
  const index = userRooms.findIndex((v) => v.id === room.id);
  if (index >= 0) {
    userRooms[index] = room;
  } else {
    userRooms.push(room);
  }

  updateRoom(room);

  return {
    ...state,
    userRooms,
  };
}

// --------------------------
// Reducer

export default (
  state: IRoomState = defaultRooms,
  action: RoomsAction,
) => {
  switch (action.type) {
    case RoomsActionTypes.setReady:
      return setReady(state, action);
    case RoomsActionTypes.setActiveRooms:
      return setActiveRooms(state, action);
    case RoomsActionTypes.setUserRooms:
      return setUserRooms(state, action);
    case RoomsActionTypes.saveRoom:
      return saveRoom(state, action);
    default:
      return state;
  }
};

import { combineReducers } from 'redux';
import { ThunkAction } from 'redux-thunk';
import firebase from '../middleware/firebase';
import { noop } from '../misc';
import { Dispatch, IState } from '../reducers';

const collectionName = 'rooms';

// ----------------------------------------------------------------------------
// states

interface IRecord {
  createdAt: firebase.firestore.Timestamp;
  id: string;
  updatedAt: firebase.firestore.Timestamp;
}

export interface IRoom extends IRecord {
  name: string;
  status: RoomStatus;
  textbookContent: string;
  userId: string;
}

export enum RoomStatus {
  draft = 0, // only owner can access
  public = 1, // public for those who know the URL
  active = 2, // public and listed
}

export interface IRoomState {
  activeRoomIds: string[];
  docs: IIdMap<IRoom>;
  userRoomIds: string[];
}

interface IIdMap<T> { [id: string]: T; }

const initialRoomState = Object.freeze<IRoomState>({
  activeRoomIds: [],
  docs: {},
  userRoomIds: [],
});

export const emptyRoom = Object.freeze<IRoom>({
  createdAt: new firebase.firestore.Timestamp(0, 0),
  id: '',
  name: '',
  status: RoomStatus.draft,
  textbookContent: '',
  updatedAt: new firebase.firestore.Timestamp(0, 0),
  userId: '',
});

export function pickRoom (state: IState, roomId: string) {
  const room = state.rooms.docs[roomId];
  return room;
}

export function pickRoomsByIds (state: IState, roomIds: string[]) {
  const rooms = roomIds.map((id) => pickRoom(state, id));
  return rooms;
}

export function pickUserRooms (state: IState) {
  return pickRoomsByIds(state, state.rooms.userRoomIds);
}

export function pickActiveRooms (state: IState) {
  return pickRoomsByIds(state, state.rooms.activeRoomIds);
}

// ----------------------------------------------------------------------------
// actions

interface ISetUserRoomsAction {
  rooms: IRoom[];
  type: 'Rooms/setUserRooms';
}

export function setUserRooms (rooms: IRoom[]): ISetUserRoomsAction {
  return {
    rooms,
    type: 'Rooms/setUserRooms',
  };
}

interface ICreateRoomAction {
  room: IRoom;
  type: 'Rooms/createRoom';
}

export function createRoom (room: IRoom) {
  if (room.id) {
    throw new Error('New room must not have ID');
  }

  if (!room.userId) {
    throw new Error('Room must have user ID');
  }

  if (!room.name) {
    throw new Error('Room must have name');
  }

  return async (dispatch: Dispatch): Promise<IRoom> => {
    const newRoom: IRoom = {
      ...room,
      createdAt: firebase.firestore.Timestamp.now(),
      status: room.status || RoomStatus.draft,
      textbookContent: room.textbookContent || `# ${room.name}`,
      updatedAt: firebase.firestore.Timestamp.now(),
    };

    const collRef = firebase.firestore().collection(collectionName);
    const docRef = await collRef.add(newRoom);

    newRoom.id = docRef.id;

    dispatch<ICreateRoomAction>({
      room: newRoom,
      type: 'Rooms/createRoom',
    });

    return newRoom;
  };
}

interface ISaveRoomAction {
  room: IRoom;
  type: 'Rooms/saveRoom';
}

export function saveRoom (room: IRoom) {
  return (dispatch: Dispatch) => {
    const roomValues = {
      ...room,
      createdAt: room.createdAt || firebase.firestore.Timestamp.now(),
      updatedAt: firebase.firestore.Timestamp.now(),
    };

    dispatch<ISaveRoomAction>({
      room: roomValues,
      type: 'Rooms/saveRoom',
    });

    const collRef = firebase.firestore().collection(collectionName);
    return collRef.doc(roomValues.id).update(roomValues);
  };
}

interface ISetActiveRoomsAction {
  rooms: IRoom[];
  type: 'Rooms/setActiveRooms';
}

export function setActiveRooms (rooms: IRoom[]): ISetActiveRoomsAction {
  return {
    rooms,
    type: 'Rooms/setActiveRooms',
  };
}

export type RoomsAction =
  | ISetUserRoomsAction
  | ICreateRoomAction
  | ISaveRoomAction
  | ISetActiveRoomsAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceActiveRoomIds (
  state: string[] = [],
  action: RoomsAction,
): string[] {
  switch (action.type) {
    case 'Rooms/setActiveRooms':
      return action.rooms.map((v) => v.id);
    default:
      return state;
  }
}

export function reduceDocs (
  state: IIdMap<IRoom> = {},
  action: RoomsAction,
): IIdMap<IRoom> {
  switch (action.type) {
    case 'Rooms/createRoom':
    case 'Rooms/saveRoom': {
      const docs = { ...state };
      docs[action.room.id] = action.room;
      return docs;
    }
    case 'Rooms/setActiveRooms':
    case 'Rooms/setUserRooms': {
      const docs = { ...state };
      action.rooms.forEach((v) => docs[v.id] = v);
      return docs;
    }
    default:
      return state;
  }
}

export function reduceUserRoomIds (
  state: string[] = [],
  action: RoomsAction,
): string[] {
  switch (action.type) {
    case 'Rooms/setUserRooms':
      return action.rooms.map((v) => v.id);
    default:
      return state;
  }
}

export const reduceRooms = combineReducers<IRoomState>({
  activeRoomIds: reduceActiveRoomIds,
  docs: reduceDocs,
  userRoomIds: reduceUserRoomIds,
});

// ----------------------------------------------------------------------------
// connectors

export function connectRoom (
  roomId: string,
  onNext: (room: IRoom | null) => void,
  onError: (error: Error) => void = noop,
  onEach: () => void = noop,
): () => void {
  if (!roomId) {
    throw new Error('Room ID must not be empty');
  }

  const docRef = firebase.firestore().collection(collectionName).doc(roomId);
  const unsubscribe = docRef.onSnapshot(
    (snapshot) => {
      onNext(snapshotToRoom(snapshot));
      onEach();
    },
    (error) => {
      onError(error);
      onEach();
    },
  );
  return unsubscribe;
}

export function connectUserRooms (
  userId: string,
  onNext: (rooms: IRoom[]) => void,
  onError: (error: Error) => void = noop,
  onEach: () => void = noop,
): () => void {
  if (!userId) {
    onEach();
    return noop;
  }

  const collRef = firebase.firestore().collection(collectionName)
    .where('userId', '==', userId);
  const unsubscribe = collRef.onSnapshot(
    (snapshot) => {
      const rooms = snapshot.docs.map((v) => snapshotToRoom(v));
      onNext(rooms);
      onEach();
    },
    (error) => {
      onError(error);
      onEach();
    },
  );
  return unsubscribe;
}

export function connectActiveRooms (
  onNext: (rooms: IRoom[]) => void,
  onError: (error: Error) => void = noop,
  onEach: () => void = noop,
): () => void {
  const collRef = firebase.firestore().collection(collectionName)
    .where('status', '==', RoomStatus.active);
  const unsubscribe = collRef.onSnapshot(
    (snapshot) => {
      const rooms = snapshot.docs.map((v) => snapshotToRoom(v));
      onNext(rooms);
      onEach();
    },
    (error) => {
      onError(error);
      onEach();
    },
  );
  return unsubscribe;
}

export function snapshotToRoom (
  snapshot: firebase.firestore.QueryDocumentSnapshot,
): IRoom;
export function snapshotToRoom (
  snapshot: firebase.firestore.DocumentSnapshot,
): IRoom | null;
export function snapshotToRoom (
  snapshot: firebase.firestore.DocumentSnapshot,
): IRoom | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  const e = emptyRoom;
  return {
    createdAt: data.createdAt || e.createdAt,
    id: snapshot.id,
    name: data.name || e.name,
    status: data.status || e.status,
    textbookContent: data.textbookContent || e.textbookContent,
    updatedAt: data.updatedAt || e.updatedAt,
    userId: data.userId || e.userId,
  };
}

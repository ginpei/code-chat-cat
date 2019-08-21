import { combineReducers } from 'redux';
import firebase from '../middleware/firebase';
import { noop } from '../misc';
import { AppDispatch, AppState } from './Store';

const collectionName = 'rooms';

// ----------------------------------------------------------------------------
// states

interface Record {
  createdAt: firebase.firestore.Timestamp;
  id: string;
  updatedAt: firebase.firestore.Timestamp;
}

export interface Room extends Record {
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

export interface RoomState {
  activeRoomIds: string[];
  docs: IdMap<Room>;
  userRoomIds: string[];
}

interface IdMap<T> { [id: string]: T; }

export const emptyRoom = Object.freeze<Room>({
  createdAt: new firebase.firestore.Timestamp(0, 0),
  id: '',
  name: '',
  status: RoomStatus.draft,
  textbookContent: '',
  updatedAt: new firebase.firestore.Timestamp(0, 0),
  userId: '',
});

export function pickRoom (state: AppState, roomId: string) {
  const room = state.rooms.docs[roomId];
  return room;
}

export function pickRoomsByIds (state: AppState, roomIds: string[]) {
  const rooms = roomIds.map((id) => pickRoom(state, id));
  return rooms;
}

export function pickUserRooms (state: AppState) {
  return pickRoomsByIds(state, state.rooms.userRoomIds);
}

export function pickActiveRooms (state: AppState) {
  return pickRoomsByIds(state, state.rooms.activeRoomIds);
}

// ----------------------------------------------------------------------------
// actions

interface SetUserRoomsAction {
  rooms: Room[];
  type: 'Rooms/setUserRooms';
}

export function setUserRooms (rooms: Room[]): SetUserRoomsAction {
  return {
    rooms,
    type: 'Rooms/setUserRooms',
  };
}

interface CreateRoomAction {
  room: Room;
  type: 'Rooms/createRoom';
}

export function createRoom (room: Room) {
  if (room.id) {
    throw new Error('New room must not have ID');
  }

  if (!room.userId) {
    throw new Error('Room must have user ID');
  }

  if (!room.name) {
    throw new Error('Room must have name');
  }

  return async (dispatch: AppDispatch): Promise<Room> => {
    const newRoom: Room = {
      ...room,
      createdAt: firebase.firestore.Timestamp.now(),
      status: room.status || RoomStatus.draft,
      textbookContent: room.textbookContent || `# ${room.name}`,
      updatedAt: firebase.firestore.Timestamp.now(),
    };

    const collRef = firebase.firestore().collection(collectionName);
    const docRef = await collRef.add(newRoom);

    newRoom.id = docRef.id;

    dispatch<CreateRoomAction>({
      room: newRoom,
      type: 'Rooms/createRoom',
    });

    return newRoom;
  };
}

interface SaveRoomAction {
  room: Room;
  type: 'Rooms/saveRoom';
}

export function saveRoom (room: Room) {
  return (dispatch: AppDispatch) => {
    const roomValues = {
      ...room,
      createdAt: room.createdAt || firebase.firestore.Timestamp.now(),
      updatedAt: firebase.firestore.Timestamp.now(),
    };

    dispatch<SaveRoomAction>({
      room: roomValues,
      type: 'Rooms/saveRoom',
    });

    const collRef = firebase.firestore().collection(collectionName);
    return collRef.doc(roomValues.id).update(roomValues);
  };
}

interface StoreRoomAction {
  room: Room;
  type: 'Rooms/storeRoom';
}

export function storeRoom (room: Room): StoreRoomAction {
  return {
    room,
    type: 'Rooms/storeRoom',
  };
}

interface RemoveRoomAction {
  room: Room;
  type: 'Rooms/removeRoom';
}

export function removeRoom (room: Room) {
  if (!room.id) {
    throw new Error('Room must have ID');
  }

  return (dispatch: AppDispatch) => {
    dispatch<RemoveRoomAction>({
      room,
      type: 'Rooms/removeRoom',
    });

    const collRef = firebase.firestore().collection(collectionName);
    return collRef.doc(room.id).delete();
  };
}

interface SetActiveRoomsAction {
  rooms: Room[];
  type: 'Rooms/setActiveRooms';
}

export function setActiveRooms (rooms: Room[]): SetActiveRoomsAction {
  return {
    rooms,
    type: 'Rooms/setActiveRooms',
  };
}

export type RoomsAction =
  | SetUserRoomsAction
  | CreateRoomAction
  | StoreRoomAction
  | RemoveRoomAction
  | SaveRoomAction
  | SetActiveRoomsAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceActiveRoomIds (
  state: string[] = [],
  action: RoomsAction,
): string[] {
  switch (action.type) {
    case 'Rooms/removeRoom': {
      const index = state.findIndex((v) => v === action.room.id);
      if (index > -1) {
        const rooms = [...state];
        rooms.splice(index, 1);
        return rooms;
      } else {
        return state;
      }
    }
    case 'Rooms/setActiveRooms':
      return action.rooms.map((v) => v.id);
    default:
      return state;
  }
}

export function reduceDocs (
  state: IdMap<Room> = {},
  action: RoomsAction,
): IdMap<Room> {
  switch (action.type) {
    case 'Rooms/createRoom':
    case 'Rooms/saveRoom':
    case 'Rooms/storeRoom': {
      const docs = { ...state };
      docs[action.room.id] = action.room;
      return docs;
    }
    case 'Rooms/removeRoom': {
      const docs = { ...state };
      delete docs[action.room.id];
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
    case 'Rooms/removeRoom': {
      const index = state.findIndex((v) => v === action.room.id);
      if (index > -1) {
        const rooms = [...state];
        rooms.splice(index, 1);
        return rooms;
      } else {
        return state;
      }
    }
    case 'Rooms/setUserRooms':
      return action.rooms.map((v) => v.id);
    default:
      return state;
  }
}

export const reduceRooms = combineReducers<RoomState>({
  activeRoomIds: reduceActiveRoomIds,
  docs: reduceDocs,
  userRoomIds: reduceUserRoomIds,
});

// ----------------------------------------------------------------------------
// connectors

export function connectRoom (
  roomId: string,
  onNext: (room: Room | null) => void,
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
  onNext: (rooms: Room[]) => void,
  onError: (error: Error) => void = noop,
  onEach: () => void = noop,
): () => void {
  if (!userId) {
    onEach();
    return noop;
  }

  const collRef = firebase.firestore().collection(collectionName)
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc');
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
  onNext: (rooms: Room[]) => void,
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
): Room;
export function snapshotToRoom (
  snapshot: firebase.firestore.DocumentSnapshot,
): Room | null;
export function snapshotToRoom (
  snapshot: firebase.firestore.DocumentSnapshot,
): Room | null {
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

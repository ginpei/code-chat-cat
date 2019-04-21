import firebase from '../middleware/firebase';
import { noop } from '../misc';

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

export const emptyRoom = Object.freeze<IRoom>({
  createdAt: new firebase.firestore.Timestamp(0, 0),
  id: '',
  name: '',
  status: RoomStatus.draft,
  textbookContent: '',
  updatedAt: new firebase.firestore.Timestamp(0, 0),
  userId: '',
});

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

export type UserRoomAction =
  | ISetUserRoomsAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceUserRooms (
  state: IRoom[] = [],
  action: UserRoomAction,
): IRoom[] {
  switch (action.type) {
    case 'Rooms/setUserRooms':
      return action.rooms;
    default:
      return state;
  }
}

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
    id: data.id || e.id,
    name: data.name || e.name,
    status: data.status || e.status,
    textbookContent: data.textbookContent || e.textbookContent,
    updatedAt: data.updatedAt || e.updatedAt,
    userId: data.userId || e.userId,
  };
}

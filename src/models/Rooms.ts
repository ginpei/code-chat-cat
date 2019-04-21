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

function getEmptyRoom (): IRoom {
  return {
    createdAt: new firebase.firestore.Timestamp(0, 0),
    id: '',
    name: '',
    status: RoomStatus.draft,
    textbookContent: '',
    updatedAt: new firebase.firestore.Timestamp(0, 0),
    userId: '',
  };
}

// ----------------------------------------------------------------------------
// connectors

export function connectRoom (
  roomId: string,
  onNext: (snapshot: firebase.firestore.DocumentSnapshot) => void,
  onError: (error: Error) => void = noop,
  onEach: () => void = noop,
): () => void {
  if (!roomId) {
    throw new Error('Room ID must not be empty');
  }

  const docRef = firebase.firestore().collection(collectionName).doc(roomId);
  const unsubscribe = docRef.onSnapshot(
    (snapshot) => {
      onNext(snapshot);
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

  const empty = getEmptyRoom();
  return {
    createdAt: data.createdAt || empty.createdAt,
    id: data.id || empty.id,
    name: data.name || empty.name,
    status: data.status || empty.status,
    textbookContent: data.textbookContent || empty.textbookContent,
    updatedAt: data.updatedAt || empty.updatedAt,
    userId: data.userId || empty.userId,
  };
}

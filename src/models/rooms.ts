import firebase from '../middleware/firebase';
import { Store } from '../reducers';
import { IRoom, IRoomRecord, RoomsActionTypes } from '../reducers/rooms';
import migrateRoom, { roomVersion } from './rooms.migration';

const roomsRef = firebase.firestore().collection('/rooms');

let unsubscribeUserRooms: (() => void) | null = null;
export function connectUserRooms2 (store: Store) {
  if (unsubscribeUserRooms) {
    return unsubscribeUserRooms;
  }
  unsubscribeUserRooms = null;

  let userId: string = '';
  let unsubscribeUserRoomsSnapshot: () => void = () => undefined;
  const unsubscribeStore = store.subscribe(() => {
    const state = store.getState();
    const newUserId = state.currentUser.uid;
    if (newUserId === userId) {
      return;
    }
    unsubscribeUserRoomsSnapshot();
    userId = newUserId;

    if (!userId) {
      return;
    }

    const userRoomsRef = roomsRef.where('userId', '==', userId);
    unsubscribeUserRoomsSnapshot = userRoomsRef.onSnapshot({
      error: (error) => {
        console.error('Error on user rooms connection', error);
      },
      next: (snapshot) => {
        const rooms = snapshot.docs
          .map((v) => snapshotToRoom(v))
          .filter((v) => v) as IRoom[];
        store.dispatch({
          rooms,
          type: RoomsActionTypes.setUserRooms,
        });
      },
    });
  });

  unsubscribeUserRooms = () => {
    unsubscribeUserRooms = null;
    unsubscribeStore();
    unsubscribeUserRoomsSnapshot();
  };
  return unsubscribeUserRooms;
}

export async function loadActiveRooms (): Promise<IRoom[]> {
  const snapshot = await roomsRef
    .where('active', '==', true)
    .get();
  return snapshot.docs.map((v) => snapshotToRoom(v)!);
}

type ConnectRoomCallback = (room: IRoom | null) => void;
type ConnectRoomErrorCallback = (error: Error) => void;
export function connectRoom (
  id: string,
  callback: ConnectRoomCallback,
  onError?: ConnectRoomErrorCallback,
): () => void {
  return roomsRef.doc(id).onSnapshot((snapshot) => {
    const room = snapshotToRoom(snapshot);
    callback(room);
  }, onError);
}

type ConnectRoomsCallback = (rooms: IRoom[]) => void;
type ConnectRoomsErrorCallback = (error: Error) => void;
export function connectUserRooms (
  userId: string,
  callback: ConnectRoomsCallback,
  onError?: ConnectRoomsErrorCallback,
): () => void {
  return roomsRef.where('userId', '==', userId).onSnapshot((snapshot) => {
    const rooms = snapshot.docs.map((docSnapshot) => snapshotToRoom(docSnapshot)!);
    callback(rooms);
  }, onError);
}

export function createRoom (
  roomData: { name: string; userId: string; },
) {
  return new Promise<IRoom>(async (resolve, reject) => {
    try {
      const record: IRoomRecord = {
        active: false,
        createdAt: firebase.firestore.Timestamp.now(),
        modelVersion: roomVersion,
        name: roomData.name,
        textbookContent: `# ${roomData.name}`,
        updatedAt: firebase.firestore.Timestamp.now(),
        userId: roomData.userId,
      };
      const docRef = await roomsRef.add(record);

      const snapshot = await docRef.get();
      const room = snapshotToRoom(snapshot);
      if (!room) {
        throw new Error('Failed to get room');
      }
      resolve(room);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateRoom (room: IRoom): Promise<void> {
  const record = roomToRecord(room);
  record.createdAt = record.createdAt || firebase.firestore.Timestamp.now();
  record.updatedAt = firebase.firestore.Timestamp.now();
  return roomsRef.doc(room.id).update(record);
}

export async function deleteRoom (room: IRoom) {
  return roomsRef.doc(room.id).delete();
}

type RoomObserver = (error: Error | null, room?: IRoom | null) => void;
export function observeRoom (id: string, observer: RoomObserver): () => void {
  const ref = roomsRef.doc(id);
  return ref.onSnapshot((snapshot) => {
    const room = snapshotToRoom(snapshot);
    observer(null, room);
  }, (error) => {
    observer(error);
  });
}

function snapshotToRoom (snapshot: firebase.firestore.DocumentSnapshot): IRoom | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  const migratedData = migrateRoom(data);

  return {
    active: migratedData.active,
    createdAt: migratedData.createdAt,
    id: snapshot.id,
    name: migratedData.name,
    textbookContent: migratedData.textbookContent,
    updatedAt: migratedData.updatedAt,
    userId: migratedData.userId,
  };
}

function roomToRecord (room: IRoom): IRoomRecord {
  return {
    ...room,
    modelVersion: roomVersion,
  };
}

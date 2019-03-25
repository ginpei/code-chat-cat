import firebase from '../middleware/firebase';
import { Store } from '../reducers';
import { IRoom, IRoomRecord, RoomsActionTypes, RoomStatus } from '../reducers/rooms';
import migrateRoom, { roomVersion } from './rooms.migration';

const roomsRef = firebase.firestore().collection('/rooms');

let unsubscribeUserRooms: (() => void) | null = null;
export function connectUserRooms (store: Store) {
  if (unsubscribeUserRooms) {
    return unsubscribeUserRooms;
  }
  unsubscribeUserRooms = null;

  let userId: string = '.'; // this ID never exists
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
      store.dispatch({
        rooms: [],
        type: RoomsActionTypes.setUserRooms,
      });
      store.dispatch({
        ready: true,
        type: RoomsActionTypes.setReady,
      });
      return;
    }

    store.dispatch({
      ready: false,
      type: RoomsActionTypes.setReady,
    });

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
        store.dispatch({
          ready: true,
          type: RoomsActionTypes.setReady,
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

let unsubscribeActiveRooms: (() => void) | null = null;
export function connectActiveRooms (store: Store, callback?: () => void) {
  if (unsubscribeActiveRooms) {
    if (callback) {
      callback();
    }
    return unsubscribeActiveRooms;
  }
  unsubscribeActiveRooms = null;
  let calledBack = false;

  let unsubscribeSnapshot: () => void = () => undefined;
  const userRoomsRef = roomsRef.where('status', '==', RoomStatus.active);
  unsubscribeSnapshot = userRoomsRef.onSnapshot({
    error: (error) => {
      console.error('Error on user rooms connection', error);
    },
    next: (snapshot) => {
      const rooms = snapshot.docs
        .map((v) => snapshotToRoom(v))
        .filter((v) => v) as IRoom[];
      store.dispatch({
        rooms,
        type: RoomsActionTypes.setActiveRooms,
      });

      if (callback && !calledBack) {
        callback();
        calledBack = true;
      }
    },
  });

  unsubscribeActiveRooms = () => {
    unsubscribeActiveRooms = null;
    unsubscribeSnapshot();
  };
  return unsubscribeActiveRooms;
}

export function createRoom (
  roomData: { name: string; userId: string; },
) {
  return new Promise<IRoom>(async (resolve, reject) => {
    try {
      const record: IRoomRecord = {
        createdAt: firebase.firestore.Timestamp.now(),
        modelVersion: roomVersion,
        name: roomData.name,
        status: RoomStatus.draft,
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

function snapshotToRoom (snapshot: firebase.firestore.DocumentSnapshot): IRoom | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  const migratedData = migrateRoom(data);

  return {
    createdAt: migratedData.createdAt,
    id: snapshot.id,
    name: migratedData.name,
    status: migratedData.status,
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

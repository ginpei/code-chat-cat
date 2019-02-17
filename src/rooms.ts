import { Store } from 'redux';
import firebase from './middleware/firebase';
import { IRoom, RoomsActionTypes } from './reducers/rooms';

export async function loadRooms (user: firebase.User): Promise<IRoom[]> {
  const snapshot = await firebase.firestore().collection('/rooms').get();
  return snapshot.docs.map((ds) => {
    const data = ds.data();
    return {
      id: ds.id,
      name: data.name,
      textbookContent: data.textbookContent,
    };
  });
}

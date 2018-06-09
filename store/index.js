import firebase from '~/plugins/firebase';
import { firebaseMutations, firebaseAction } from 'vuexfire'

const roomsRef = firebase.database().ref('/rooms');
const roomStorageRef = firebase.storage().ref('/rooms');

export const state = () => ({
  rooms: [],
});

export const getters = {
  roomOf: (state) => (id) => state.rooms.find(v => v['.key'] === id),

  roomRefOf: () => (id) => roomsRef.child(id),

  filesOf: (_, getters) => (id) => {
    const room = getters['roomOf'](id);
    if (!room || !room.files || room.files.length < 1) {
      return [];
    }

    const fileMap = room.files;
    const files = Object.keys(fileMap)
      .map((key) => fileMap[key] )
      .sort((f1, f2) => f1.name.toLowerCase() > f2.name.toLowerCase());
    return files;
  },

  textMarkdownOf: (_, getters) => (id) => {
    const room = getters['roomOf'](id);
    return room && room.textMarkdown.value;
  },
};

export const mutations = {
  ...firebaseMutations
};

export const actions = {
  setRoomsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('rooms', ref);
  }),

  setTextMarkdown: firebaseAction(({ getters }, { roomId, value }) => {
    if (!roomId) {
      throw new Error('Valid room ID is required');
    }

    roomsRef.child(roomId).child('textMarkdown').set(value);
  }),

  uploadFile: async ({ getters }, { roomId, file }) => {
    if (!roomId) {
      throw new Error('Valid room ID is required');
    }

    // upload
    const fname = file.name;  // TODO escape
    const fileRef = roomStorageRef.child(roomId).child(fname);
    const snapshot = await fileRef.put(file);

    // save info
    const url = await snapshot.ref.getDownloadURL();
    const info = {
      name: file.name,
      size: file.size,
      type: file.type,
      url,
    };
    const storageDataRef = getters['roomRefOf'](roomId).child('files');
    storageDataRef.push(info);
  },
}

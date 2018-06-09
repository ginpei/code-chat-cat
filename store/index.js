import firebase from '~/plugins/firebase';
import { firebaseMutations, firebaseAction } from 'vuexfire'

const roomsRef = firebase.database().ref('/rooms');
const roomsStorageRef = firebase.storage().ref('/rooms');

export const state = () => ({
  rooms: [],
});

export const getters = {
  roomOf: (state) => (id) => state.rooms.find(v => v['.key'] === id),

  roomRefOf: () => (id) => roomsRef.child(id),
  roomStorageRefOf: () => (id) => roomsStorageRef.child(id),

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

    // prepare space and key
    const storageDataRef = getters['roomRefOf'](roomId).child('files');
    const infoRef = storageDataRef.push();

    // upload
    const fileRef = getters['roomStorageRefOf'](roomId).child(infoRef.key);
    const storedFile = await fileRef.put(file);

    // save info
    const url = await storedFile.ref.getDownloadURL();
    infoRef.set({
      key: infoRef.key,
      name: file.name,
      size: file.size,
      type: file.type,
      url,
    });
  },

  deleteFile: async ({ getters }, { roomId, file }) => {
    if (!roomId || !file || !file.key) {
      throw new Error('Valid room ID and file info are required');
    }

    // delete file
    const fileRef = getters['roomStorageRefOf'](roomId).child(file.key);
    await fileRef.delete();

    // delete info
    const infoRef = getters['roomRefOf'](roomId).child('files').child(file.key);
    await infoRef.remove();
  },
}

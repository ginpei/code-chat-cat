import firebase from '~/plugins/firebase';
import { firebaseAction } from 'vuexfire'

const roomsRef = firebase.database().ref('/rooms');
const roomsStorageRef = firebase.storage().ref('/rooms');

export const state = () => ({
  loadingRoom: true,
  rooms: [],
});

export const mutations = {
  setLoading (state, loading) {
    state.loadingRoom = loading;
  },
};

export const getters = {
  roomOf: (state) => (id) => state.rooms.find(v => v['.key'] === id),
  roomsOfInstructor: (state) => (uid) => state.rooms.filter(v => v.userId === uid),
  roomUrl: () => (room, suffix) => `/rooms/${room['.key']}/${suffix}`,
  roomRefOf: () => (id) => roomsRef.child(id),
  studentsRefOf: () => (id) => roomsRef.child(id).child('students'),
  studentRefOf: (_, getters) => (roomId, studentId) => getters['studentsRefOf'](roomId).child(studentId),
  messagesRefOf: () => (id) => roomsRef.child(id).child('messages'),
  roomStorageRefOf: () => (id) => roomsStorageRef.child(id),

  filesOf: (_, getters) => (id) => {
    const sort = (f1, f2) => f1.name.toLowerCase() > f2.name.toLowerCase();
    return getters.anyOf(id, 'files', sort);
  },

  textMarkdownOf: (_, getters) => (id) => {
    const room = getters['roomOf'](id);
    return room && room.textMarkdown.value;
  },

  messagesOf: (_, getters) => (id) => {
    const sort = (m1, m2) => m1.createdAt < m2.createdAt;
    return getters.anyOf(id, 'messages', sort);
  },

  anyOf: (_, getters) => (roomId, childKey, sort) => {
    const room = getters['roomOf'](roomId);
    if (!room || !room[childKey] || room[childKey].length < 1) {
      return [];
    }

    const itemMap = room[childKey];
    const items = Object.keys(itemMap)
      .map((key) => itemMap[key])
      .sort(sort);
    return items;
  },
};

export const actions = {
  setRoomsRef: firebaseAction(async ({ bindFirebaseRef, commit }, ref) => {
    bindFirebaseRef('rooms', ref);

    commit('setLoading', true);
    await ref.once('value');
    commit('setLoading', false);
  }),

  setTextMarkdown: (_, { roomId, value }) => {
    if (!roomId) {
      throw new Error('Valid room ID is required');
    }

    roomsRef.child(roomId).child('textMarkdown').set(value);
  },

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

  saveStudent: async ({ getters }, { roomId, studentId, name }) => {
    if (!roomId || !studentId || !name) {
      console.warn(roomId, studentId, name);
      throw new Error('Valid room ID and file info are required');
    }

    const studentRef = getters['studentRefOf'](roomId, studentId);
    await studentRef.set({ name });
  },

  postChat: async ({ getters }, { roomId, studentId, message }) => {
    if (!roomId || !studentId || !message) {
      throw new Error('Valid info are required');
    }

    const messagesRef = getters['messagesRefOf'](roomId);
    const studentRef = getters['studentRefOf'](roomId, studentId);
    const { name } = (await studentRef.once('value')).val();

    messagesRef.push({
      studentId,
      name,
      body: message,
      createdAt: Date.now(),
    });
  },
}

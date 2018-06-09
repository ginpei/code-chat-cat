import firebase from '~/plugins/firebase';
import { firebaseMutations, firebaseAction } from 'vuexfire'

const db = firebase.database();
const roomsRef = db.ref('/rooms');

export const state = () => ({
  rooms: [],
});

export const getters = {
  roomOf: (state) => (id) => state.rooms.find(v => v['.key'] === id),

  textMarkdownOf: (state, getters) => (id) => {
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

    roomsRef.child(roomId).set({ textMarkdown: value });
  }),
}

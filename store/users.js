// import firebase from '~/plugins/firebase';
import { firebaseAction } from 'vuexfire'

// const roomsRef = firebase.database().ref('/rooms');
// const roomsStorageRef = firebase.storage().ref('/rooms');

export const state = () => ({
  users: [],
  currentUserId: '',
  loadingCount: 0,
});

export const mutations = {
  countLoading (state, count) {
    state.loadingCount += count;
  },

  setCurrentUserId (state, userId) {
    state.currentUserId = userId;
  },
};

export const getters = {
  loading: (state) => state.loadingCount > 0,
  currentUser: (state, getters) =>  getters.userOf(state.currentUserId),
  userOf: (state) => (userId) => state.users.find(v => v['.key'] === userId),
};

export const actions = {
  setUsersRef: firebaseAction(async ({ bindFirebaseRef, commit }, ref) => {
    bindFirebaseRef('users', ref);

    commit('countLoading', +1);
    await ref.once('value');
    commit('countLoading', -1);
  }),

  updateCurrentUser ({ commit }, userId) {
    if (!userId) {
      throw new Error('User ID must bet set');
    }

    commit('setCurrentUserId', userId);
  },
}

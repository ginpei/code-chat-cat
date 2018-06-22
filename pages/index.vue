<template lang="pug">
  div
    div.container.logo
      a(href="/signIn")
        img.logo-image(src="~assets/logo-512.png" width="256" height="256" alt="Face of Code Chat Cat")
    div.container
      h1 Classes
      ul
        li(v-for="room in rooms")
          a(:href="roomLink(room)") {{ room.title }}
    footer.footer
      p
        a(href="/signIn") Sign in as instructor
      p
        | Created by&nbsp;
        a(href="https://ginpei.info/") Ginpei Takanashi
</template>

<script>
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  async asyncData ({ params, store, error }) {
    const roomsRef = firebase.database().ref('rooms');
    store.dispatch('rooms/setRoomsRef', roomsRef);
    await roomsRef.once('value');
  },

  computed: {
    ...mapState('rooms', [
      'rooms',
    ]),
  },

  created () {
    this.setRoomsRef(firebase.database().ref('rooms'));
  },

  methods: {
    roomLink (room) {
      if (!room) {
        throw new Error('Room must be given');
      }
      if (!room['.key']) {
        throw new Error('Invalid room object');
      }
      return `/rooms/${room['.key']}`;
    },

    ...mapActions('rooms', [
      'setRoomsRef',
    ]),
  },
};
</script>

<style lang="scss">
.logo {
  text-align: center;

  .logo-image {
    &:hover {
      transform: scale(1.01);
    }
  }
}

.footer {
  border-top: 1px solid gray;
  margin-top: 3em;
  padding: 1em 0 1em;
  text-align: center;
}
</style>

<template lang="pug">
  div.container
    div.logo
      img.logo-image(src="~assets/logo-512.png" width="256" height="256" alt="Face of Code-Class-Chat Cat")
    h1 Classes
    ul
      li(v-for="room in rooms")
        a(:href="roomLink(room)") {{ room.title }}
</template>

<script>
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
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
.container {
  max-width: 800px;
  margin: 0 auto;
  // min-height: 100vh;
  // min-width: 512px;
  // padding: 20px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}

.logo {
  text-align: center;

  .logo-image {
    &:hover {
      transform: scale(1.01);
    }
  }
}
</style>

<template lang="pug">
  HeaderLayout
    div.container
      h1 Create
      ul
        li
          a(href="/rooms/new") Create new class room
      h1 Your class rooms
      p(v-if="loading") ...
      ul(v-if="rooms.length > 0")
        li(v-for="room in rooms")
          a(:href="roomUrl(room, 'edit')") {{ room.title }}
      div(v-if="!loading && rooms.length < 1")
        p No rooms found.
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    HeaderLayout,
  },

  computed: {
    loading () {
      return this.loadingUser || this.loadingRoom;
    },

    rooms () {
      return this.currentUser ? this.roomsOfInstructor(this.currentUser.id) : [];
    },

    ...mapState([
      'currentUser',
      'loadingUser',
    ]),

    ...mapState('rooms', [
      'loadingRoom',
    ]),

    ...mapGetters('rooms', [
      'roomsOfInstructor',
      'roomUrl',
    ]),
  },

  created () {
    this.setAuth(firebase.auth());
    this.setRoomsRef(firebase.database().ref('rooms'));
  },

  methods: {
    ...mapActions([
      'setAuth',
    ]),

    ...mapActions('rooms', [
      'setRoomsRef',
    ]),
  },
};
</script>

<style lang="scss" scoped>
</style>

<template lang="pug">
  HeaderLayout(:processing="processing" :links="headerLinks")
    slot
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    HeaderLayout,
  },

  props: [
    'processing',
    'roomId',
  ],

  computed: {
    headerLinks () {
      return [
        {
          title: 'Room',
          items: [
            { title: 'Home', href: this.roomUrlOf(this.roomId) },
            { title: 'Manage', href: this.roomUrlOf(this.roomId, 'manage') },
            { title: 'Edit', href: this.roomUrlOf(this.roomId, 'edit') },
          ],
        },
        {
          title: this.userName,
          items: [
            { title: 'My rooms', href: '/rooms/' },
            { title: 'Sign out', href: '/signOut' },
          ],
        },
      ];
    },

    ...mapGetters([
      'userName',
    ]),

    ...mapGetters('rooms', [
      'roomUrlOf',
    ]),
  },

  created () {
    this.setAuth(firebase.auth());
  },

  methods: {
    ...mapActions([
      'setAuth',
    ]),
  },
};
</script>

<style lang="scss" scoped>
</style>

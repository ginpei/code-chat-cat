<template lang="pug">
  HeaderLayout(:processing="processing" :title="room ? room.title : ''" :links="headerLinks" :container="container" :no-footer="noFooter")
    slot
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapGetters } from 'vuex';

export default {
  components: {
    HeaderLayout,
  },

  props: [
    'processing',
    'roomId',
    'container',
    'noFooter',
  ],

  computed: {
    headerLinks () {
      return [
        {
          title: 'Room',
          items: [
            { title: 'Home', href: this.roomUrlOf(this.roomId) },
            { title: 'Manage', href: this.roomUrlOf(this.roomId, 'manage') },
            { title: 'Edit Textbook', href: this.roomUrlOf(this.roomId, 'textbook') },
          ],
        },
      ];
    },

    room () {
      return this.roomOf(this.roomId);
    },

    ...mapGetters('rooms', [
      'roomOf',
      'roomUrlOf',
    ]),
  },
};
</script>

<style lang="scss" scoped>
</style>

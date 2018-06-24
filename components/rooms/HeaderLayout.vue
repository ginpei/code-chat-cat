<template lang="pug">
  HeaderLayout(:processing="processing" :links="headerLinks")
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
      ];
    },

    ...mapGetters('rooms', [
      'roomUrlOf',
    ]),
  },
};
</script>

<style lang="scss" scoped>
</style>

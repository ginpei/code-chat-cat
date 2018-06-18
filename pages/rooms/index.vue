<template lang="pug">
  HeaderLayout
    div.container
      h1 Your class rooms
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapState } from 'vuex';

export default {
  components: {
    HeaderLayout,
  },

  computed: {
    ...mapState([
      'currentUser',
      'loadingUser',
    ]),
  },

  created () {
    this.$store.dispatch('setAuth', firebase.auth());
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>

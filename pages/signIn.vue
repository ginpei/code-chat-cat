<template lang="pug">
  HeaderLayout
    div.container
      h1 Sign In
      h2 Student
      p If you are looking for your today's class, please ask your instructor for your class room's URL.
      ul
        li
          a(href="/") Class list
      h2 Instructor
      p You are going to sign in as an instructor and will be able to manage your own classes.
      ul
        li
          button(disabled) Google
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
// import firebase from '~/plugins/firebase.js';
// import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    HeaderLayout,
  }
};
</script>

<style lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1em;
}
</style>

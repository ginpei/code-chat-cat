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
      div(v-if="signedIn")
        p.warnMessage
          | You have already signed in.
        ul
          li
            a(href="/rooms/") Manage your classes
          li
            a(href="/signOut") Sign out
      div(v-if="!signedIn")
        p
          button(@click="signInGoogle_onClick" :disabled="loadingUser || signingIn") Google
        p.errorMessage(v-show="signInErrorMessage")
          = "ERROR: "
          | {{ signInErrorMessage }}
      p {{ $store.state.n }}
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapState } from 'vuex';

export default {
  components: {
    HeaderLayout,
  },

  data () {
    return {
      signInErrorMessage: '',
      signingIn: false,
    };
  },

  computed: {
    user () {
      return this.$store.state.currentUser;
    },

    signedIn () {
      return Boolean(this.user);
    },

    ...mapState([
      'currentUser',
      'loadingUser',
    ]),
  },

  created () {
    this.$store.dispatch('setAuth', firebase.auth());
  },

  methods: {
    locateAfterSigningIn () {
      location.href = '/rooms/';
    },

    async signInGoogle_onClick () {
      this.signingIn = true;
      this.signInErrorMessage = '';

      var provider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);
      } catch (error) {
        this.signInErrorMessage = error.message;
      }

      this.signingIn = false;
      this.locateAfterSigningIn();
    },
  },
};
</script>

<style lang="scss">
</style>

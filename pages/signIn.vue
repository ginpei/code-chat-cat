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
            a(href="/") Manage your classes
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
    },
  },
};
</script>

<style lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1em;
}

.warnMessage {
  background-color: cornSilk;
  border: 2px solid gold;
  padding: 0.2em 0.4em;
}

.errorMessage {
  background-color: mistyRose;
  border: 2px solid tomato;
  padding: 0.2em 0.4em;
}
</style>

<template lang="pug">
  div.layout(:signedIn="signedIn")
    div.layout-header
      div.header
        div.header-logo {{ roomTitle }}
    div.layout-main(v-if="signedIn")
      MainText.content-body(:markdown="textMarkdown")
    div.layout-sidebar(v-if="signedIn")
      div.sidebar
        section.sidebar-section.fileManager
          h1.sidebar-heading Files
          FileList(:files="files")
        section.sidebar-section.accountManager
          h1.sidebar-heading Account
          div
            button(@click="signOut") Sign Out
    div.layout-signIn(v-if="!initializing && !signedIn")
      div.signIn
        form.signIn-box(@submit.prevent="signIn_onSubmit")
          h1.signIn-heading Welcome!
          p.signIn-message Input your name and sign in to the class.
          div.signIn-form
            input.signIn-input(v-model="userNameInput" placeholder="Alice")
            button.signIn-signIn Sign In
    div.initializing(v-if="initializing")
      div.initializing-box *
      div.initializing-box *
      div.initializing-box *
</template>

<script>
import MainText from '~/components/MainText.vue';
import FileList from '~/components/FileList.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MainText,
    FileList,
  },

  head () {
    return {
      titleTemplate: `${this.roomTitle} - %s`,
    }
  },

  async asyncData ({ params, store, error }) {
    const roomsRef = firebase.database().ref('rooms');
    store.dispatch('setRoomsRef', roomsRef);
    await roomsRef.once('value');
    const room = store.getters['roomOf'](params.id);
    if (!room) {
      error({ statusCode: 404, message: 'Room not found' })
    }

    const user = firebase.auth().currentUser;

    return { room, user };
  },

  data () {
    return {
      loadingUser: true,
      userNameInput: '',
    };
  },

  computed: {
    initializing () {
      // return true;
      return this.loadingUser;
    },

    signedIn () {
      return Boolean(this.user);
    },

    roomId () {
      return this.$route.params.id;
    },

    roomTitle () {
      return this.room.title;
    },

    textMarkdown () {
      return this.textMarkdownOf(this.roomId);
    },

    files () {
      return this.filesOf(this.roomId);
    },

    ...mapGetters([
      'roomOf',
      'filesOf',
      'textMarkdownOf',
    ]),
  },

  created () {
    this.$store.dispatch('setRoomsRef', firebase.database().ref('rooms'));
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if (this.loadingUser) {
        this.loadingUser = false;
      }
    });
  },

  methods: {
    async signIn ({ name }) {
      await firebase.auth().signInAnonymously();
    },

    async signOut () {
      await firebase.auth().signOut();
    },

    signIn_onSubmit () {
      const name = this.userNameInput.trim();
      if (name) {
        this.signIn({ name });
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.layout {
  --layout-header-height: 1.2rem;

  display: grid;
  grid-template:
    "header" var(--layout-header-height)
    "signIn" calc(100% - var(--layout-header-height))
    / auto;
  height: 100vh;

  &[signedIn] {
    grid-template:
      "header header" var(--layout-header-height)
      "sidebar main" calc(100% - var(--layout-header-height))
      / 10rem auto;
  }

  .layout-header {
    grid-area: header;
  }

  .layout-main {
    box-shadow: 0.2rem 0.2rem 0.2rem #0003 inset;
    grid-area: main;
    overflow: auto;
  }

  .layout-sidebar {
    border-right: 1px solid gray;
    grid-area: sidebar;
  }

  .layout-signIn {
    grid-area: signIn;
  }
}

.header {
    background-color: #036;
    color: #fff;
    font-size: 0.8rem;
    line-height: var(--layout-header-height);
    grid-area: header;
    padding: 0 1rem;
}

.content-body {
  margin: 1rem;
}

.sidebar-section {
  padding: 0 1rem;
}

.fileManager {
  min-height: 200px;
}

.signIn {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;

  .signIn-box {
    border: 1px solid lightgray;
    border-radius: 0.2rem;
    box-shadow: 0 0 1rem #0001;
    padding: 2em;
    width: 300px;
  }

  .signIn-heading,
  .signIn-message {
    margin-bottom: 1rem;
  }

  .signIn-form {
    display: grid;
  }

  .signIn-label {
    display: block;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .signIn-input {
    margin-left: 0.2em;
    padding: 0.4em;
  }

  .signIn-controls {
    text-align: right;
  }

  .signIn-signIn {
    height: 2em;
    min-width: 7em;
  }
}

.initializing {
  background-color: #fff3;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  width: 100%;

  .initializing-box {
    animation: rotate 1s infinite;
    height: 30px;
    text-align: center;
    width: 30px;

    &:nth-child(1) {
      animation-delay: 0ms;
    }
    &:nth-child(2) {
      animation-delay: 100ms;
    }
    &:nth-child(3) {
      animation-delay: 200ms;
    }
  }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

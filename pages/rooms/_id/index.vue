<template lang="pug">
  div.layout(:signedIn="signedIn")
    div.layout-header
      div.header
        div.header-logo {{ roomTitle }}
    div.layout-main(v-if="initializing")
      Processing
    div.layout-main(v-if="!initializing && !signedIn")
      SignIn(@SignIn_submit="signIn_onSubmit")
    div.layout-main(v-if="!initializing && signedIn")
      div.classBoard
        div.classBoard-textbook
          div.textbook
            MainText.textbook-body(:markdown="textMarkdown")
        div.classBoard-sidebar
          div.sidebar
            section.sidebar-section.fileManager
              h1.sidebar-heading Files
              FileList(:files="files")
            section.sidebar-section.accountManager
              h1.sidebar-heading Account
              div
                button(@click="signOut") Sign Out
        div.classBoard-chat
          Chat(@Chat-submit="chat_onSubmit" :messages="messages")
</template>

<script>
import SignIn from '~/components/rooms/SignIn.vue';
import Processing from '~/components/rooms/Processing.vue';
import Chat from '~/components/Chat.vue';
import MainText from '~/components/MainText.vue';
import FileList from '~/components/FileList.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    SignIn,
    Processing,
    Chat,
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

    messages () {
      return this.messagesOf(this.roomId);
    },

    files () {
      return this.filesOf(this.roomId);
    },

    ...mapState([
      'userName',
    ]),

    ...mapGetters([
      'roomOf',
      'filesOf',
      'textMarkdownOf',
      'messagesOf',
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
      this.loadingUser = true;
      await firebase.auth().signInAnonymously();
      this.saveUser({ name });
    },

    async signOut () {
      this.loadingUser = true;
      await firebase.auth().signOut();
    },

    saveUser ({ name }) {
      const payload = {
        roomId: this.roomId,
        userId: this.user.uid,
        name: name,
      };
      this.$store.dispatch('saveUser', payload);
    },

    signIn_onSubmit ({ nameInput }) {
      const name = nameInput.trim();
      if (name) {
        this.signIn({ name });
      }
    },

    chat_onSubmit ({ message }) {
      const payload = {
        roomId: this.roomId,
        userId: this.user.uid,
        message,
      };
      this.$store.dispatch('postChat', payload);
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
    "main" calc(100% - var(--layout-header-height))
    / auto;
  height: 100vh;

  .layout-header {
    grid-area: header;
  }

  .layout-main {
    grid-area: main;
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

.classBoard {
  display: grid;
  grid-template:
    "sidebar textbook chat" auto
    / 10rem calc(100% - 30rem) 20rem;
  height: 100%;

  .classBoard-textbook {
    box-shadow: 0.2rem 0.2rem 0.2rem #0003 inset;
    grid-area: textbook;
    overflow: auto;
  }

  .classBoard-sidebar {
    border-right: 1px solid gray;
    grid-area: sidebar;
    overflow: auto;
  }

  .classBoard-chat {
    border-left: 1px solid gray;
    grid-area: chat;
    overflow: auto;
  }
}

.textbook {
  .textbook-body {
    margin: 1rem;
  }
}

.sidebar {
  .sidebar-section {
    padding: 0 1rem;
  }
}

.fileManager {
  min-height: 200px;
}
</style>

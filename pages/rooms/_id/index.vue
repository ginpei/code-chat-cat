<template lang="pug">
  HeaderLayout.HeaderLayout(:processing="initializing" :title="roomTitle" :title-link="roomUrl" :container="false" :no-footer="true")
    div.HeaderLayout-main(v-if="!signedIn")
      SignIn(@SignIn_submit="signIn_onSubmit")
    div.HeaderLayout-main(v-if="signedIn")
      div.classBoard
        div.classBoard-textbook
          div.textbook
            Textbook.textbook-body(:markdown="textMarkdown")
        div.classBoard-sidebar
          div.sidebar
            section.sidebar-section.fileManager
              h1.sidebar-heading Files
              FileList(:files="files")
            section.sidebar-section.accountManager
              h1.sidebar-heading Account
              div Name: {{userName}}
              div
                button(@click="signOut") Sign Out
            section.sidebar-section.chat
              h1.sidebar-heading Chat
              Chat(@Chat-submit="chat_onSubmit" :messages="messages")
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import SignIn from '~/components/rooms/SignIn.vue';
import Processing from '~/components/Processing.vue';
import Chat from '~/components/rooms/Chat.vue';
import Textbook from '~/components/rooms/Textbook.vue';
import FileList from '~/components/rooms/FileList.vue';
import firebase from '~/plugins/firebase.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    HeaderLayout,
    SignIn,
    Processing,
    Chat,
    Textbook,
    FileList,
  },

  head () {
    return {
      titleTemplate: `${this.roomTitle} - %s`,
    }
  },

  async asyncData ({ params, store, error }) {
    const roomsRef = firebase.database().ref('rooms');
    store.dispatch('rooms/setRoomsRef', roomsRef);
    await roomsRef.once('value');
    const room = store.getters['rooms/roomOf'](params.id);
    if (!room) {
      error({ statusCode: 404, message: 'Room not found' })
    }

    const instructor = firebase.auth().currentUser;

    return { room, instructor };
  },

  data () {
    return {
      loadingInstructor: true,
    };
  },

  computed: {
    initializing () {
      // return true;
      return this.loadingInstructor;
    },

    signedIn () {
      return Boolean(this.instructor);
    },

    userName () {
      const u = this.currentUser;
      return u ? (u.name || '(No name)') : '';
    },

    roomId () {
      return this.$route.params.id;
    },

    roomTitle () {
      return this.room.title;
    },

    roomUrl () {
      return `/rooms/${this.roomId}/`;
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

    ...mapGetters('rooms', [
      'roomOf',
      'filesOf',
      'textMarkdownOf',
      'messagesOf',
    ]),

    ...mapGetters('users', [
      'currentUser',
    ]),
  },

  created () {
    this.setRoomsRef(firebase.database().ref('rooms'));
    this.setUsersRef(firebase.database().ref('users'));
    firebase.auth().onAuthStateChanged((user) => {
      this.instructor = user;
      if (this.loadingInstructor) {
        this.loadingInstructor = false;
      }

      this.updateCurrentUser(user.uid);
    });
  },

  methods: {
    async signIn ({ name }) {
      this.loadingInstructor = true;
      await firebase.auth().signInAnonymously();
      const payload = {
        roomId: this.roomId,
        studentId: this.instructor.uid,
        name: name,
      };
      this.saveStudent(payload);
    },

    async signOut () {
      this.loadingInstructor = true;
      await firebase.auth().signOut();
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
        studentId: this.instructor.uid,
        message,
      };
      this.postChat(payload);
    },

    ...mapActions('rooms', [
      'setRoomsRef',
      'saveStudent',
      'postChat',
    ]),

    ...mapActions('users', [
      'setUsersRef',
      'updateCurrentUser',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.HeaderLayout {
  .HeaderLayout-main {
    height: calc(100vh - var(--defaultLayout-headerHeight));
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
  --sidebar-width: 20em;

  display: grid;
  grid-template:
    "sidebar textbook chat" auto
    / var(--sidebar-width) calc(100% - var(--sidebar-width));
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

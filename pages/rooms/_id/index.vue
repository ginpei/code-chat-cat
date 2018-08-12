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

    const user = firebase.auth().currentUser;

    return {
      currentUserId: user.uid,
      room,
    };
  },

  data () {
    return {
      loadingCurrentUser: true,
    };
  },

  computed: {
    initializing () {
      // return true;
      return this.loadingCurrentUser;
    },

    signedIn () {
      return Boolean(this.userName);
    },

    currentUser () {
      return this.userOf(this.roomId, this.currentUserId);
    },

    userName () {
      return this.currentUser && this.currentUser.name;
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
      'userOf',
      'messagesOf',
    ]),
  },

  created () {
    this.setRoomsRef(firebase.database().ref('rooms'));
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        user = await firebase.auth().signInAnonymously();
      }
      this.currentUserId = user.uid;

      if (!this.currentUser) {
        await this.createMember({ roomId: this.roomId, userId: user.uid });
      }

      this.loadingCurrentUser = false;
    });
  },

  methods: {
    async signIn ({ name }) {
      const payload = {
        roomId: this.roomId,
        userId: this.currentUserId,
        name: name,
      };
      this.saveMember(payload);
    },

    async signOut () {
      this.loadingCurrentUser = true;
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
        userId: this.currentUserId,
        message,
      };
      this.postChat(payload);
    },

    ...mapActions('rooms', [
      'setRoomsRef',
      'setCurrentRoomRef',
      'createMember',
      'saveMember',
      'postChat',
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

// .fileManager {
// }
</style>

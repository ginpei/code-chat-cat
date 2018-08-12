<template lang="pug">
  HeaderLayout.HeaderLayout(:title="roomTitle" :title-link="roomUrl" :container="false" :no-footer="true")
    div.HeaderLayout-main.layout
      div.layout-main
        textarea.main(@input="main_onInput" @scroll="main_onScroll" :value="textMarkdown" ref="main")
      div.layout-sub
        div.content(@scroll="sub_onScroll" ref="sub")
          Textbook.content-body(:markdown="textMarkdown")
      div.layout-sidebar
        div.sidebar
          section.sidebar-section.fileManager(
            @dragover.prevent="fileManager_onDragOver"
            @dragleave.prevent="fileManager_onDragLeave"
            @drop.prevent="fileManager_onDrop"
            :data-fileDraggingOver="fileDraggingOver"
          )
            h1.sidebar-heading Files
            p
              input(ref="upload" @change="upload_onChange" type="file" multiple)
              br
              | or drop here
            FileList(@FileList-delete="FileList_delete" :files="files" :editable="true")
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import Textbook from '~/components/rooms/Textbook.vue';
import FileList from '~/components/rooms/FileList.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

const storageRef = firebase.storage().ref();

export default {
  components: {
    HeaderLayout,
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

    return { room };
  },

  data () {
    return {
      elBeingScrolled: null,
      fileDraggingOver: false,
    }
  },

  computed: {
    roomId () {
      return this.$route.params.id;
    },

    roomTitle () {
      return this.room && this.room.title;
    },

    roomUrl () {
      return `/rooms/${this.roomId}/`;
    },

    textMarkdown () {
      return this.textMarkdownOf(this.roomId);
    },

    files () {
      return this.filesOf(this.roomId);
    },

    ...mapGetters('rooms', [
      'roomOf',
      'filesOf',
      'textMarkdownOf',
    ]),
  },

  created () {
    this.$store.dispatch('rooms/setRoomsRef', firebase.database().ref('rooms'));
  },

  methods: {
    setTextMarkdown ({ value }) {
      const payload = { roomId: this.roomId, value };
      this.$store.dispatch('rooms/setTextMarkdown', payload);
    },

    synchronizeScrolling (elFrom, elTo) {
      // stop infinite loop
      if (this.elBeingScrolled && this.elBeingScrolled !== elFrom) {
        return;
      }

      this.elBeingScrolled = elFrom;
      clearTimeout(this.rmResetScrollingSynchronously);
      this.rmResetScrollingSynchronously = setTimeout(() => {
        this.elBeingScrolled = null;
      }, 100);

      const scrollProgress = elFrom.scrollTop / (elFrom.scrollHeight - elFrom.clientHeight);
      const top = (elTo.scrollHeight - elTo.clientHeight) * scrollProgress;
      elTo.scrollTop = top;
    },

    main_onInput () {
      const value = this.$refs.main.value;
      this.setTextMarkdown({ value });
    },

    main_onScroll () {
      this.synchronizeScrolling(this.$refs.main, this.$refs.sub);
    },

    sub_onScroll () {
      this.synchronizeScrolling(this.$refs.sub, this.$refs.main);
    },

    upload_onChange (event) {
      console.log('# event', event);
      const files = Array.from(this.$refs.upload.files);
      files.forEach((file) => {
        console.log(`${file.name} (${file.type})`, file);
        this.$store.dispatch('rooms/uploadFile', { roomId: this.roomId, file });
      });
      this.$refs.upload.value = '';
    },

    fileManager_onDragOver () {
      this.fileDraggingOver = true;
    },

    fileManager_onDragLeave () {
      this.fileDraggingOver = false;
    },

    fileManager_onDrop (event) {
      this.fileDraggingOver = false;
      const files = Array.from(event.dataTransfer.files);
      files.forEach((file) => {
        console.log(`${file.name} (${file.type})`, file);
        this.$store.dispatch('rooms/uploadFile', { roomId: this.roomId, file });
      });
    },

    FileList_delete (file) {
        this.$store.dispatch('deleteFile', { roomId: this.roomId, file });
    },
  }
}
</script>

<style lang="scss" scoped>
.HeaderLayout {
  .HeaderLayout-main {
    height: calc(100vh - var(--defaultLayout-headerHeight));
  }
}

.layout {
  display: grid;
  grid-template:
    "sidebar main sub" 100%
    / 10rem calc((100% - 10rem) / 2) calc((100% - 10rem) / 2);
  height: 100vh;

  .layout-main {
    box-shadow: 0.2rem 0.2rem 0.2rem #0003 inset;
    grid-area: main;
  }

  .layout-sub {
    box-shadow: 0.2rem 0.2rem 0.2rem #0003 inset;
    grid-area: sub;
  }

  .layout-sidebar {
    border-right: 1px solid gray;
    grid-area: sidebar;
  }
}

textarea.main {
  display: block;
  height: 100%;
  padding: 1em 1em 10rem;
  resize: none;
  width: 100%;
}

.content {
  height: 100%;
  overflow: auto;

  .content-body {
    margin: 1rem;
  }
}

.fileManager {
  padding: 0 1rem;

  &[data-fileDraggingOver] {
    background-color: khaki;
  }
}
</style>

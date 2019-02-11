<template lang="pug">
  HeaderLayout.HeaderLayout( :roomId="roomId" :container="false" :no-footer="true")
    div.HeaderLayout-main.layout
      div.layout-main
        div.editor
          div.editor-tabs
            EditorTabItem(
              v-for="book in books"
              @EditorTabItem-select="tabItem_onSelect(book)"
              @EditorTabItem-close="tabItem_onClose(book)"
              :label="book.name" :permanent="book.permanent" :active="isActiveBook(book)")
          div.editor-editor
            TextbookEditor(@input="main_onInput" :textMarkdown="textMarkdown")
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
            FileList(@FileList-copy="FileList_copy" @FileList-delete="FileList_delete"
              :files="files" :editable="true")
</template>

<script>
import HeaderLayout from '~/components/rooms/HeaderLayout.vue';
import Textbook from '~/components/rooms/Textbook.vue';
import TextbookEditor from '~/components/rooms/TextbookEditor.vue';
import FileList from '~/components/rooms/FileList.vue';
import EditorTabItem from '~/components/rooms/EditorTabItem.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';
import util from '~/plugins/util.js';

const storageRef = firebase.storage().ref();

export default {
  components: {
    HeaderLayout,
    Textbook,
    EditorTabItem,
    TextbookEditor,
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
      books: [
        { id: 'dummyfile1', name: 'Textbook', permanent: true },
        { id: 'dummyfile2', name: 'Preparation 1', },
        { id: 'dummyfile3', name: 'Preparation 2', },
      ],
      editingBook: 'dummyfile1',
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

    isActiveBook (book) {
      return book.id === this.editingBook;
    },

    tabItem_onSelect (book) {
      console.log(`# select`, book.name);
    },

    tabItem_onClose (book) {
      console.log(`# close`, book.name);
    },

    main_onInput ({ value }) {
      console.log('# value', value);
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

    FileList_copy (file) {
      util.copyFileLink(file);
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
  --sidebar-width: 20rem;

  display: grid;
  grid-template:
    "sidebar main" 100%
    / var(--sidebar-width) calc((100% - var(--sidebar-width)));
  height: 100vh;

  .layout-main {
    grid-area: main;
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

.sidebar-section {
  padding: 0 1rem;
}

.fileManager {
  &[data-fileDraggingOver] {
    background-color: khaki;
  }
}

.editor {
  display: grid;
  grid-template:
    "tabs" 2em
    "editor" calc(100% - 2em)
    / 100%;
  height: 100%;

  .editor-tabs {
    background-color: lightgray;
    grid-area: tabs;
    line-height: 2em;
  }

  .editor-editor {
    grid-area: editor;
  }

  .editor-tabs {
    padding: 0 0.2em;
  }
}
</style>

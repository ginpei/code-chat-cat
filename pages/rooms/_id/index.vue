<template lang="pug">
  div.layout
    div.layout-header
      div.header
        div.header-logo {{ roomTitle }}
    div.layout-main
      MainText.content-body(:markdown="textMarkdown")
    div.layout-sidebar
      div.sidebar
        section.sidebar-section.fileManager
          h1.sidebar-heading Files
          FileList(:files="files")
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

  computed: {
    roomId () {
      return this.$route.params.id;
    },

    roomTitle () {
      return this.roomOf(this.roomId).title;
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
  },
}
</script>

<style lang="scss" scoped>
.layout {
  --layout-header-height: 1.2rem;

  display: grid;
  grid-template:
    "header header" var(--layout-header-height)
    "sidebar main" calc(100% - var(--layout-header-height))
    / 10rem auto;
  height: 100vh;

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

.fileManager {
  min-height: 200px;
  padding: 0 1rem;
}
</style>

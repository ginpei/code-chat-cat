<template lang="pug">
  div.layout
    div.layout-header
      div.header
        div.header-logo Code Class &amp; Chat
    div.layout-main
      article.text(v-html="contentHtml")
    div.layout-sidebar
      div.sidebar
        section.sidebar-section
          h1.sidebar-heading Files
</template>

<script>
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters } from 'vuex';
import MarkdownIt from 'markdown-it';

const db = firebase.database();
const mdit = new MarkdownIt();

export default {
  components: {
  },

  data () {
    return {
      html: new Array(100).join('# Hey\n\n'),
    }
  },

  computed: {
    roomId () {
      return this.$route.params.id;
    },

    textMarkdown () {
      return this.textMarkdownOf(this.roomId);
    },

    contentHtml () {
      const markdown = this.textMarkdown;
      if (typeof markdown !== 'string') {
        console.log('# markdown', this.roomId, markdown);
        return '';
      }
      return mdit.render(markdown);
    },

    ...mapState({
      rooms: 'rooms',
    }),

    ...mapGetters({
      roomOf: 'roomOf',
      textMarkdownOf: 'textMarkdownOf',
    }),
  },

  created () {
    this.$store.dispatch('setRoomsRef', db.ref('rooms'));
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
    / 5rem auto;
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
</style>

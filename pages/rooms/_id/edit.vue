<template lang="pug">
  div.layout
    div.layout-header
      div.header
        div.header-logo Code Class &amp; Chat
    div.layout-main
      textarea.main(@input="main_onInput" @scroll="main_onScroll" :value="textMarkdown" ref="main")
    div.layout-sub
      article.content(@scroll="sub_onScroll" ref="sub")
        div.content-body(v-html="contentHtml")
    div.layout-sidebar
      div.sidebar
        section.sidebar-section
          h1.sidebar-heading Files
</template>

<script>
import firebase from '~/plugins/firebase.js';
import MarkdownIt from 'markdown-it';
import { mapState, mapGetters, mapActions } from 'vuex';

const mdit = new MarkdownIt();

export default {
  components: {
  },

  data () {
    return {
      elBeingScrolled: null,
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
        console.log('# markdown', markdown);
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
    this.$store.dispatch('setRoomsRef', firebase.database().ref('rooms'));
  },

  methods: {
    setTextMarkdown (value) {
      const payload = { roomId: this.roomId, value };
      this.$store.dispatch('setTextMarkdown', payload);
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
  }
}
</script>

<style lang="scss" scoped>
.layout {
  --layout-header-height: 1.2rem;

  display: grid;
  grid-template:
    "header header header" var(--layout-header-height)
    "sidebar main sub" calc(100% - var(--layout-header-height))
    / 5rem calc((100% - 5rem) / 2) calc((100% - 5rem) / 2);
  height: 100vh;

  .layout-header {
    grid-area: header;
  }

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

.header {
    background-color: #036;
    color: #fff;
    font-size: 0.8rem;
    line-height: var(--layout-header-height);
    grid-area: header;
    padding: 0 1rem;
}

textarea.main {
  height: 100%;
  padding: 1em;
  width: 100%;
}

.content {
  height: 100%;
  overflow: auto;

  .content-body {
    margin: 1rem;
  }
}
</style>

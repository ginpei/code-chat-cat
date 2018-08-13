<template lang="pug">
  div.layout
    div.layout-main
      textarea.main(@input="main_onInput" @scroll="main_onScroll" :value="textMarkdown" ref="main")
    div.layout-sub
      div.content(@scroll="sub_onScroll" ref="sub")
        Textbook.content-body(:markdown="textMarkdown")
</template>

<script>
import Textbook from '~/components/rooms/Textbook.vue';

export default {
  props: [
    'textMarkdown',
  ],

  components: {
    Textbook,
  },

  data () {
    return {
      elBeingScrolled: null,
    }
  },

  computed: {
  },

  methods: {
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
      this.$emit('input', { value });
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
  display: grid;
  grid-template:
    "main sub" 100%
    / 50% 50%;
  height: 100%;

  .layout-main {
    box-shadow: 0.2rem 0.2rem 0.2rem #0003 inset;
    grid-area: main;
  }

  .layout-sub {
    box-shadow: 0.2rem 0.2rem 0.2rem #0003 inset;
    grid-area: sub;
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
</style>

<template lang="pug">
  div.MainText(v-html="contentHtml")
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const mdit = new MarkdownIt({
  highlight: (string, language) => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(language, string).value;
      } catch (_) {}
    }

    return '';
  },
});

export default {
  props: [
    'markdown',
  ],

  computed: {
    contentHtml () {
      return mdit.render(this.markdown || '');
    },
  },
}
</script>

<style lang="scss">
.MainText {
  pre {
    background-color: #282b2e;
    color: #a9b7c6;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;  // from GitHub
    font-size: 85%;
    padding: 1em;
  }
}
</style>

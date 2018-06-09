<template lang="pug">
  div.ManText(v-html="contentHtml")
</template>

<script>
import MarkdownIt from 'markdown-it';

const mdit = new MarkdownIt();

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

<style lang="scss" scoped>
</style>

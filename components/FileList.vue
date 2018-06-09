<template lang="pug">
  div.FileList
</template>

<script>

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
.FileList {
}
</style>

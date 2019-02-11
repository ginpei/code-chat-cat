<template lang="pug">
  ul.FileList
    li.fileItem(v-for="file in files")
      a.fileItem-link(:href="file.url") 📓 {{ file.name }}
      span.fileItem-edit
        button.fileItem-copy(@click="copy_onClick(file)" v-if="editable" title="Copy link") ∞
        button.fileItem-remove(@click="remove_onClick(file)" v-if="editable" title="Delete") ✘
</template>

<script>

export default {
  props: [
    'files',
    'editable',
  ],

  methods: {
    copy_onClick (file) {
      this.$emit('FileList-copy', file);
    },

    remove_onClick (file) {
      const message = `${file.name}\n\nAre you sure you want to delete this file?`;
      const ok = confirm(message);
      if (ok) {
        this.$emit('FileList-delete', file);
      }
    },
  },
}
</script>

<style lang="scss">
.FileList {
  list-style-type: none;
  padding: 0;
}

.fileItem {
  display: grid;
  grid-template: "filename edit" / auto 1.5em;
  word-break: break-all;

  .fileItem-link {
    display: block;
    padding: 0.2em 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .fileItem-edit {
    visibility: hidden;
  }

  .fileItem-copy,
  .fileItem-remove {
    background-color: transparent;
    border-style: none;
  }

  &:hover {
    .fileItem-edit {
      visibility: visible;
    }
  }
}
</style>

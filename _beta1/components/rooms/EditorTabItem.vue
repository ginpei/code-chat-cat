<template lang="pug">
  span.tabItem.active(:active="active" @click="onClick")
    span.tabItem-label {{ label }}
    span.tabItem-close(v-if="!permanent" @click="close_onClick") ×
</template>

<script>
// import Textbook from '~/components/rooms/Textbook.vue';

export default {
  props: [
    'label',
    'permanent',
    'active',
  ],

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
    onClick (event) {
      if (!event.target.closest('.tabItem-close')) {
        this.$emit('EditorTabItem-select')
      }
    },

    close_onClick () {
      this.$emit('EditorTabItem-close')
    },
  },
}
</script>

<style lang="scss" scoped>

.tabItem {
  --height: 1.6em;

  background-color: white;
  border: 1px gray;
  border-style: solid solid none;
  cursor: pointer;
  display: inline-block;
  height: var(--height);
  line-height: var(--height);
  margin-right: 0.2em;
  padding: 0 0.5em;
  vertical-align: bottom;

  &[active] {
    --height: 1.8em;
  }

  .tabItem-close {
    border-radius: 0.2em;
    display: inline-block;
    height: 1em;
    line-height: 1em;
    text-align: center;
    margin-left: 0.5em;
    vertical-align: middle;
    width: 1em;

    &:hover {
      background-color: lightgray;
    }
  }
}
</style>

<template lang="pug">
  div.ChatMessageItem
    span.ChatMessageItem-name {{ name }}
    span.ChatMessageItem-message {{ body }}
    span.ChatMessageItem-dateTime {{ dateTimeText }}
</template>

<script>
import ChatMessageItem from './ChatMessageItem.vue';

export default {
  props: [
    'message',
  ],

  computed: {
    name () {
      return this.message.name;
    },

    body () {
      return this.message.body;
    },

    dateTimeText () {
      const d = new Date(this.message.createdAt);
      return [
        [
          d.getFullYear(),
          this.fillZero(d.getMonth() + 1, 2),
          this.fillZero(d.getDate(), 2),
        ].join('-'),
        ' ',
        [
          this.fillZero(d.getHours(), 2),
          this.fillZero(d.getMinutes(), 2),
          this.fillZero(d.getSeconds(), 2),
        ].join(':'),
      ].join('');
    },
  },

  methods: {
    fillZero (n, digits) {
      return `${new Array(digits).join('0')}${n}`.slice(-digits);
    },
  },
};
</script>

<style lang="scss" scoped>
.ChatMessageItem {
  margin: 1rem;

  .ChatMessageItem-name {
    font-weight: bold;
    margin-right: 0.5em;

    &::after {
      content: ":";
    }
  }

  .ChatMessageItem-dateTime {
    color: #ccc;
    font-size: 0.8em;
    margin-left: 0.5em;
  }
}
</style>

<template lang="pug">
  div.Chat
    div.Chat-form
      form.form
        div.form-inputWrapper
          textarea.form-input(@keydown="input_onKeyDown" v-model="input")
        div.form-note Ctrl + Enter = Send
        button.form-submit(@click="submit") Send
    div.Chat-timeline
      div.timeline
        ChatMessageItem(v-for="message in messages" :key="message.key" :message="message")
</template>

<script>
import ChatMessageItem from './ChatMessageItem.vue';

export default {
  props: [
    'messages',
  ],

  components: {
    ChatMessageItem,
  },

  data () {
    return {
      input: '',
    };
  },

  methods: {
    submit () {
      const message = this.input;
      this.$emit('Chat-submit', { message });
    },

    input_onKeyDown (event) {
      if (event.code === 'Enter' && event.ctrlKey) {
        this.submit();
        this.input = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Chat {
  display: grid;
  grid-template:
    "form" 7rem
    "timeline" auto
    / auto;

  .Chat-form {
    grid-area: form;
  }

  .Chat-timeline {
    grid-area: timeline;
  }
}

.form {
  display: grid;
  grid-template:
    "input input" 3.5rem
    "note submit" auto
    / auto 6rem;
  grid-gap: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;

  .form-inputWrapper {
    grid-area: input;
  }

  .form-input {
    height: 100%;
    padding: 0.5em;
    width: 100%;
  }

  .form-note {
    color: gray;
    font-size: 0.9em;
    grid-area: note;
  }

  .form-submit {
    grid-area: submit;
  }
}

// .timeline {
//   // nothing particularly?
// }

.timelineItem {
  margin: 1rem;

  .timelineItem-name {
    font-weight: bold;
    margin-right: 0.5em;

    &::after {
      content: ":";
    }
  }

  .timelineItem-dateTime {
    color: #999;
    font-size: 0.8em;
    margin-left: 0.5em;
  }
}
</style>

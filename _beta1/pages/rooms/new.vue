<template lang="pug">
  HeaderLayout(:processing="loadingUser")
    div.container
      h1 Create new class room
      form.xTable(@submit.prevent="onSubmit")
        label.xTable-row
          span.xTable-th Instructor:
          span.xTable-td {{ userName }}
        label.xTable-row
          span.xTable-th Room title:
          span.xTable-td
            input(v-model="input.title" required)
        p
          button Create
</template>

<script>
import HeaderLayout from '~/components/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    HeaderLayout,
  },

  data () {
    return {
      input: {
        title: '',
      },
    };
  },

  computed: {
    ...mapState([
      'loadingUser',
    ]),

    ...mapGetters([
      'userName',
    ]),

    ...mapGetters('rooms', [
      'roomOf',
      'roomUrlOf',
    ]),
  },

  created () {
    this.setAuth(firebase.auth());
  },

  methods: {
    async onSubmit () {
      const result = await this.createRoom(this.input);
      location.href = this.roomUrlOf(result.key, 'manage');
    },

    ...mapActions([
      'setAuth',
    ]),

    ...mapActions('rooms', [
      'createRoom',
    ]),
  },
};
</script>

<style lang="scss" scoped>
// would be better to rename...
.xTable {
  display: table;

  .xTable-row {
    display: table-row;
  }

  .xTable-th,
  .xTable-td {
    display: table-cell;
    padding: 0.2em 0.4em;
  }

  .xTable-th {
    text-align: right;
  }
}
</style>

<template lang="pug">
  HeaderLayout(:processing="processing" :roomId="roomId")
    div.container
      h1 Manage your class room
      h2 Information
      form.xTable
        label.xTable-row
          span.xTable-th Instructor:
          span.xTable-td {{ userName }}
        label.xTable-row
          span.xTable-th URL:
          span.xTable-td
            a(:href="roomUrl") {{ roomUrl }}
            br
            a(:href="`${roomUrl}textbook`") Edit Textbook
            = ', '
            a(:href="`${roomUrl}manage`") Manage
        label.xTable-row
          span.xTable-th Status:
          span.xTable-td {{ roomStatus ? 'Open' : 'Close' }}
      h2 Actions
        p
          button(@click="activate_onClick") Activate
          button(@click="close_onClick") Close
      h2 Settings
      form.xTable(@submit.prevent="onSubmit")
        label.xTable-row
          span.xTable-th Room title:
          span.xTable-td
            input(v-model="input.title" required)
        p
          button Update
</template>

<script>
import HeaderLayout from '~/components/rooms/HeaderLayout.vue';
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  components: {
    HeaderLayout,
  },

  data () {
    return {
      input: {
        active: false,
        title: '',
      },
      updating: false,
    };
  },

  computed: {
    processing () {
      return this.loadingUser || this.loadingRoom || !this.input || this.updating;
    },

    roomId () {
      return this.$route.params.id;
    },

    roomUrl () {
      return `${location.origin}${this.roomUrlOf(this.roomId)}`;
    },

    roomStatus () {
      return this.isActiveRoom(this.roomId);
    },

    ...mapState([
      'loadingUser',
      'userName',
    ]),

    ...mapState('rooms', [
      'loadingRoom',
    ]),

    ...mapGetters([
      'userName',
    ]),

    ...mapGetters('rooms', [
      'roomOf',
      'roomUrlOf',
      'isActiveRoom',
    ]),
  },

  created () {
    this.setAuth(firebase.auth());
    this.setRoomsRef(firebase.database().ref('rooms'));

    const tm = setInterval(() => {
      if (this.loadingRoom) {
        return;
      }

      clearInterval(tm);
      const room = this.roomOf(this.roomId);
      this.input.title = room.title;
    }, 100);
  },

  methods: {
    async activate (active) {
      const p = this.activateRoom({
        roomId: this.roomId,
        until: active ? undefined : 0,  // respect default value
      });
      try {
        await Promise.all([p, sleep(500)]);
      } catch (error) {
        console.error(error);
      }
    },

    async activate_onClick () {
      this.updating = true;
      await this.activate(true);
      this.updating = false;
    },

    async close_onClick () {
      this.updating = true;
      await this.activate(false);
      this.updating = false;
    },

    async onSubmit () {
      this.updating = true;
      const p = this.updateRoom({
        data: this.input,
        roomId: this.roomId,
      });
      try {
        await Promise.all([p, sleep(500)]);
      } catch (error) {
        console.error(error);
      }
      this.updating = false;
    },

    ...mapActions([
      'setAuth',
    ]),

    ...mapActions('rooms', [
      'setRoomsRef',
      'createRoom',
      'updateRoom',
      'activateRoom',
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

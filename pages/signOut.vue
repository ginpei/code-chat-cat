<template lang="pug">
  Processing
</template>


<script>
import Processing from '~/components/Processing.vue';
import firebase from '~/plugins/firebase.js';

export default {
  components: {
    Processing,
  },

  async mounted () {
    await firebase.auth().signOut();
    location.replace('/');
  }
}
</script>

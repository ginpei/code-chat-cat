<template lang="pug">
  div ...
</template>


<script>
import Processing from '~/components/rooms/Processing.vue';
import firebase from '~/plugins/firebase.js';

export default {
  async mounted () {
    await firebase.auth().signOut();
    location.replace('/');
  }
}
</script>

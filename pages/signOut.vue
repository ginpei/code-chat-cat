<script>
import firebase from '~/plugins/firebase.js';

export default {
  async asyncData () {
    await firebase.auth().signOut();
    error({
      statusCode: 200,
      location: '/',
    });
  }
}
</script>

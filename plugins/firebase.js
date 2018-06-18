import firebase from 'firebase';
import 'firebase/storage';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCchW1XVLnIfG_wre1PKync7ZVfUylGRV4',
    authDomain: 'hello-nuxt-firebase.firebaseapp.com',
    databaseURL: 'https://hello-nuxt-firebase.firebaseio.com/',
    // projectId: 'hello-nuxt-firebase',
    storageBucket: 'gs://hello-nuxt-firebase.appspot.com/',
  });
}

export default firebase;

import firebase from 'firebase';
import 'firebase/storage';
import config from './firebase.config.js';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;

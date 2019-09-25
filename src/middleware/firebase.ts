import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
if (!projectId || projectId === 'xxxxxxxxxxxxx') {
  throw new Error('Hey developer! You must set up Firebase config first');
  // Files you have to prepare:
  //
  // - `.firebaserc`
  // - `.env.local`
  //
  // Where you can find values:
  //
  // - Project ID - Project Overview > Project settings > General > Your project
  // - Web API Key - Project Overview > Project settings > General > Your project
  // - Authorized domains - Authentication > Sign-in method
  // - Storage bucket - Storage > Files
}

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};
firebase.initializeApp(config);

export default firebase;

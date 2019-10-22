import * as firebaseui from 'firebaseui';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import DefaultLayout from '../complexes/DefaultLayout';
import LoadingView from '../independents/LoadingView';
import firebase from '../middleware/firebase';
import { appHistory, setTitle } from '../misc';
import * as Profiles from '../models/Profiles';
import { HomeLink } from '../path';

const LoginPage: React.FC = () => {
  setTitle('Login');

  const [profile, profileInitialized, profileError] = Profiles.useProfile(
    firebase.auth(),
    firebase.firestore(),
  );

  if (profileError) {
    // TODO make component
    return (
      <div>
        <h1>Error</h1>
        {profileError.message}
      </div>
    );
  }

  if (!profileInitialized) {
    return (
      <LoadingView />
    );
  }

  if (profile) {
    return (
      <DefaultLayout>
        <h1>Logged in ✓</h1>
        <p><HomeLink/></p>
      </DefaultLayout>
    );
  }

  const uiConfig: firebaseui.auth.Config = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE, // disable AccountChooser.com
    privacyPolicyUrl: () => appHistory.push('/privacy'),
    signInOptions: [
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: () => appHistory.push('/terms'),
  };

  return (
    <DefaultLayout>
      <h1>Login</h1>
      <p><HomeLink/></p>
      <StyledFirebaseAuth
        firebaseAuth={firebase.auth()}
        uiConfig={uiConfig}
      />
    </DefaultLayout>
  );
};

export default LoginPage;

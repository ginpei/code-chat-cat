import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { connect } from 'react-redux';
import DefaultLayout from '../complexes/DefaultLayout';
import { appHistory } from '../misc';
import { HomeLink } from '../path';
import { Dispatch, IState } from '../reducers';

interface ILoginPageProps {
  loggedIn: boolean;
}

function LoginPage (props: ILoginPageProps) {
  if (props.loggedIn) {
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
}

export default connect(
  (state: IState) => ({
    loggedIn: state.currentUser.loggedIn,
  }),
)(LoginPage);

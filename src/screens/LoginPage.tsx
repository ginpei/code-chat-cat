import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import { appHistory } from '../misc';
import { Dispatch, IState } from '../reducers';

interface ILoginPageProps {
  loggedIn: boolean;
}

function LoginPage (props: ILoginPageProps) {
  if (props.loggedIn) {
    return (
      <DefaultLayout>
        <h1>Logged in ✓</h1>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
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
    signInSuccessUrl: '/login?success', // TODO
    tosUrl: () => appHistory.push('/terms'),
  };

  return (
    <DefaultLayout>
      <h1>Login</h1>
      <p><Link to="/">Home</Link></p>
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
  (dispatch: Dispatch) => ({
  }),
)(LoginPage);

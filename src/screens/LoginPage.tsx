import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import * as users from '../models/users';
import { Dispatch, IState } from '../reducers';
import { CurrentUserActionTypes } from '../reducers/currentUser';

interface ILoginPageProps {
  currentUser: any;
  setWorking: (working: boolean) => void;
  working: boolean;
}

class LoginPage extends React.Component<ILoginPageProps> {
  constructor (props: ILoginPageProps) {
    super(props);

    this.logIn = this.logIn.bind(this);
  }

  public render () {
    if (this.props.currentUser.loggedIn) {
      return (
        <DefaultLayout>
          <h1>Logged in ✓</h1>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </DefaultLayout>
      );
    }

    // TODO
    const uiConfig = {
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      privacyPolicyUrl () {
        window.location.assign('/privacy');
      },
      signInOptions: [
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: '/login?success',
      tosUrl: '/tos',
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

  public async logIn () {
    this.props.setWorking(true);
    await users.logIn();
    this.props.setWorking(false);
  }
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser,
  working: state.currentUser.working,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setWorking: (working: boolean) => dispatch({
    type: CurrentUserActionTypes.setWorking,
    working,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

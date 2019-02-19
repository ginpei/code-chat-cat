// tslint:disable:jsx-no-lambda

import React from 'react';
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

    return (
      <DefaultLayout>
        <h1>Login</h1>
        <p><Link to="/">Home</Link></p>
        <p>name [{this.props.currentUser.name}]</p>
        <p>
          { this.props.currentUser.loggedIn
            ? <Link to="/logout">Log out</Link>
            : <button onClick={this.logIn} disabled={this.props.working} >Log in</button>
          }
        </p>
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

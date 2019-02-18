// tslint:disable:jsx-no-lambda

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import * as currentUser from '../currentUser';
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
    this.logOut = this.logOut.bind(this);
  }

  public render () {
    return (
      <div>
        <Header/>
        <h1>Login</h1>
        <p><Link to="/">Home</Link></p>
        <p>name [{this.props.currentUser.name}]</p>
        <p>
          { this.props.currentUser.loggedIn
            ? <button onClick={this.logOut} disabled={this.props.working} >Log out</button>
            : <button onClick={this.logIn} disabled={this.props.working} >Log in</button>
          }
        </p>
      </div>
    );
  }

  public async logIn () {
    this.props.setWorking(true);
    await currentUser.logIn();
    this.props.setWorking(false);
  }

  public async logOut () {
    this.props.setWorking(true);
    await currentUser.logOut();
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

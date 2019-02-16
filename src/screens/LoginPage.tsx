// tslint:disable:jsx-no-lambda

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as currentUser from '../currentUser';

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

const mapStateToProps = (state: any) => ({
  currentUser: state.currentUser,
  working: state.currentUser.working,
});

const mapDispatchToProps = (dispatch: any) => ({
  setWorking: (working: boolean) => dispatch({
    type: 'currentUser/setWorking', // TODO use enum
    working,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CurrentUserActionTypes } from '../reducers/currentUser';

function LoginPage(props: any) {
  return (
    <div>
      <h1>Login</h1>
      <p><Link to="/">Home</Link></p>
      <p>
        {
          props.currentUser
          ? <button onClick={() => props.logOut()}>Log out</button>
          : <button onClick={() => props.logIn()}>Log in</button>
        }
      </p>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.currentUser,
});

const mapDispatchToProps = (dispatch: any) => ({
  logIn: () => dispatch({ type: CurrentUserActionTypes.logIn }),
  logOut: () => dispatch({ type: CurrentUserActionTypes.logOut }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

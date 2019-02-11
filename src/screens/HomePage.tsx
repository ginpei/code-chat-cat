import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function HomePage (props: any) {
  return (
    <div>
      <h1>Hello Home World!</h1>
      { props.loggedIn ? (
        <p>
          Welcome back, {props.currentUser.name}!
          <Link to="/login">Log out...</Link>
        </p>
      ) : (
        <p><Link to="/login">Login</Link></p>
      )}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  currentUser: state.currentUser,
  loggedIn: Boolean(state.currentUser),
});

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

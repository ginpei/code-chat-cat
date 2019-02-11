import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AppName = styled.h1`
  text-align: center;
`;

function HomePage (props: any) {
  return (
    <div>
      <AppName>Hello Home World!</AppName>
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

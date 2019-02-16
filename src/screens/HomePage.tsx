import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IHomePageProps {
  loggedIn: boolean;
  userName: string;
}

const AppName = styled.h1`
  text-align: center;
`;

function HomePage (props: IHomePageProps) {
  return (
    <div>
      <AppName>Hello Home World!</AppName>
      {props.loggedIn ? (
        <p>
          Welcome back, {props.userName}!
          <Link to="/login">Log out...</Link>
        </p>
      ) : (
        <p><Link to="/login">Login</Link></p>
      )}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  loggedIn: state.currentUser.loggedIn,
  userName: state.currentUser.name,
});

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

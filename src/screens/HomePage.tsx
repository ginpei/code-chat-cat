import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImageSrc from '../assets/logo-512.png';
import Container from '../components/Container';
import { getDefaultHeaderMenu } from '../components/DefaultLayout';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingView from '../components/LoadingView';
import { loadActiveRooms } from '../models/rooms';
import { Dispatch, IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IRoom } from '../reducers/rooms';

const LogoImageContainer = styled.div`
  text-align: center;
`;
const LogoImage = styled.img`
  &:hover {
    transform: scale(1.01);
  }
`;

const LogoImageSection = () => (
  <LogoImageContainer>
    <h1>Code Chat Cat</h1>
    <LogoImage src={logoImageSrc} width="256" height="256"/>
  </LogoImageContainer>
);

interface IHomePageProps {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  userProfile: IUserProfile | null;
  userRooms: IRoom[];
}

interface IHomePageState {
  ready: boolean;
  rooms: IRoom[];
}

function HomePage (props: IHomePageProps) {
  const [state, setState] = useState<IHomePageState>({
    ready: false,
    rooms: [],
  });

  if (!state.ready) {
    loadActiveRooms()
      .then((activeRooms) => {
        setState({
          ...state,
          ready: true,
          rooms: activeRooms,
        });
      })
      .catch((error) => console.error(error));
    return (
      <div>
        <Header
          title=""
        />
        <LogoImageSection/>
        <LoadingView/>
      </div>
    );
  }

  const menus = getDefaultHeaderMenu(props.userProfile);

  return (
    <div>
      <Header
        menus={menus}
        title=""
      />
      <Container>
        <LogoImageSection/>
        <p>Active rooms</p>
        <ul>
          {state.rooms.map((room) => (
            <li key={room.id}>
              <Link to={`/rooms/${room.id}`}>{room.name || '(no name)'}</Link>
            </li>
          ))}
        </ul>
        {props.loggedIn ? (
          <>
            <p>
              Welcome back, {props.userProfile!.name}!
              <Link to="/logout">Log out</Link>
            </p>
            <p>Your rooms</p>
            <ul>
              {props.userRooms.map((room) => (
                <li key={room.id}>
                  <Link to={`/rooms/${room.id}/settings`}>{room.name || '(no name)'}</Link>
                  {' / '}
                  [<Link to={`/rooms/${room.id}`}>Textbook</Link>]
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p><Link to="/login">Login</Link></p>
        )}
      </Container>
      <Footer/>
    </div>
  );
}

const mapStateToProps = (state: IState) => ({
  firebaseUser: state.currentUser.firebaseUser,
  loggedIn: state.currentUser.loggedIn,
  userProfile: state.currentUser.profile,
  userRooms: state.rooms.userRooms,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

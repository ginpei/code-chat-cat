import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImageSrc from '../assets/logo-512.png';
import Container from '../components/Container';
import Header from '../components/Header';
import { loadActiveRooms, loadOwnRooms } from '../models/rooms';
import { Dispatch, IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';

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
}

interface IHomePageState {
  ownRooms: IRoom[];
  ready: boolean;
  rooms: IRoom[];
}

function HomePage (props: IHomePageProps) {
  const [state, setState] = useState<IHomePageState>({
    ownRooms: [],
    ready: false,
    rooms: [],
  });

  if (!state.ready) {
    Promise.all([
      loadActiveRooms(),
      props.firebaseUser
        ? loadOwnRooms(props.firebaseUser.uid)
        : Promise.resolve([]),
    ])
      .then(([activeRooms, ownRooms]) => {
        setState({
          ...state,
          ownRooms,
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
        <Container>
          <p>Loading...</p>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Header
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
              {state.ownRooms.map((room) => (
                <li key={room.id}>
                  <Link to={`/rooms/${room.id}`}>{room.name || '(no name)'}</Link>
                  {' / '}
                  [<Link to={`/rooms/${room.id}/write`}>Write</Link>]
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p><Link to="/login">Login</Link></p>
        )}
      </Container>
    </div>
  );
}

const mapStateToProps = (state: IState) => ({
  firebaseUser: state.currentUser.firebaseUser,
  loggedIn: state.currentUser.loggedIn,
  userProfile: state.currentUser.profile,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImageSrc from '../assets/logo-512.png';
import Footer from '../basics/Footer';
import Header from '../basics/Header';
import { getDefaultHeaderMenu } from '../complexes/DefaultLayout';
import Container from '../independents/Container';
import LoadingView from '../independents/LoadingView';
import firebase from '../middleware/firebase';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import path, { RoomLink } from '../path';
import ErrorView from './ErrorView';

const LogoImageContainer = styled.div`
  text-align: center;
`;
const LogoImage = styled.img`
  &:hover {
    transform: scale(1.01);
  }
`;

type StateProps = {
  activeRooms: Rooms.Room[];
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  userId: string;
  userProfile: Profiles.Profile | null;
  userRooms: Rooms.Room[];
};

type DispatchProps = {
  connectUserRooms: (userId: string, setReady: () => void) => () => void;
};

type Props =
  & StateProps
  & DispatchProps;

function HomePage (props: Props) {
  const { connectUserRooms } = props;
  const [
    activeRooms,
    activeRoomsInitialized,
    activeRoomsError,
  ] = Rooms.useActiveRooms(firebase.firestore());

  const [userRoomsReady, setUserRoomsReady] = useState(false);
  useEffect(() => connectUserRooms(
    props.userId,
    () => setUserRoomsReady(true),
  ), [connectUserRooms, props.userId]);

  if (activeRoomsError) {
    return (
      <ErrorView error={activeRoomsError} />
    );
  }

  if (!activeRoomsInitialized || !userRoomsReady) {
    return (
      <LoadingView/>
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
        <LogoImageContainer>
          <h1>Code Chat Cat</h1>
          <LogoImage src={logoImageSrc} width="256" height="256"/>
        </LogoImageContainer>
        <p>Active rooms</p>
        <ul>
          {activeRooms.map((room) => (
            <li key={room.id}>
              <RoomLink room={room}/>
            </li>
          ))}
        </ul>
        {props.userProfile ? (
          <>
            <p>
              Welcome back, {props.userProfile.name}!
              <Link to={path('logout')}>Log out</Link>
            </p>
            <p>Your rooms</p>
            <ul>
              {props.userRooms.map((room) => (
                <li key={room.id}>
                  <RoomLink room={room} type="settings"/>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p><Link to={path('login')}>Login</Link></p>
        )}
      </Container>
      <Footer/>
    </div>
  );
}

export default connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    activeRooms: Rooms.pickActiveRooms(state),
    firebaseUser: state.currentUser.firebaseUser,
    loggedIn: state.currentUser.loggedIn,
    userId: state.currentUser.id,
    userProfile: state.currentUser.profile,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: AppDispatch) => ({
    connectUserRooms: (userId, setReady) => Rooms.connectUserRooms(
      userId,
      (rooms) => dispatch(Rooms.setUserRooms(rooms)),
      (error) => dispatch(ErrorLogs.add('connect user rooms', error)),
      () => setReady(),
    ),
  }),
)(HomePage);

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
import * as ErrorLogs from '../models/ErrorLogs';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import path, { RoomLink } from '../path';

const LogoImageContainer = styled.div`
  text-align: center;
`;
const LogoImage = styled.img`
  &:hover {
    transform: scale(1.01);
  }
`;

interface IHomePageProps {
  activeRooms: Rooms.IRoom[];
  connectActiveRooms: (setReady: () => void) => () => void;
  connectUserRooms: (userId: string, setReady: () => void) => () => void;
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  userId: string;
  userProfile: Profiles.IProfile | null;
  userRooms: Rooms.IRoom[];
}

function HomePage (props: IHomePageProps) {
  const [activeRoomsReady, setActiveRoomsReady] = useState(false);
  useEffect(() => props.connectActiveRooms(
    () => setActiveRoomsReady(true),
  ), []);

  const [userRoomsReady, setUserRoomsReady] = useState(false);
  useEffect(() => props.connectUserRooms(
    props.userId,
    () => setUserRoomsReady(true),
  ), [props.userId]);

  if (!activeRoomsReady || !userRoomsReady) {
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
          {props.activeRooms.map((room) => (
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

export default connect(
  (state: AppState) => ({
    activeRooms: Rooms.pickActiveRooms(state),
    firebaseUser: state.currentUser.firebaseUser,
    loggedIn: state.currentUser.loggedIn,
    userId: state.currentUser.id,
    userProfile: state.currentUser.profile,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: AppDispatch) => ({
    connectActiveRooms: (setReady: () => void) => Rooms.connectActiveRooms(
      (rooms) => dispatch(Rooms.setActiveRooms(rooms)),
      (error) => dispatch(ErrorLogs.add('connect active rooms', error)),
      () => setReady(),
    ),
    connectUserRooms: (userId: string, setReady: () => void) =>
      Rooms.connectUserRooms(
        userId,
        (rooms) => dispatch(Rooms.setUserRooms(rooms)),
        (error) => dispatch(ErrorLogs.add('connect user rooms', error)),
        () => setReady(),
      ),
  }),
)(HomePage);

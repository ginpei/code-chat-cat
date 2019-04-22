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
import { store } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';
import { connectActiveRooms } from '../models/rooms0';
import path, { RoomLink } from '../path';
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

interface IHomePageProps {
  activeRooms: IRoom[];
  connectActiveRooms: () => () => void;
  connectUserRooms: (userId: string) => () => void;
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  userId: string;
  userProfile: IUserProfile | null;
  userRooms: Rooms.IRoom[];
}

function HomePage (props: IHomePageProps) {
  useEffect(() => props.connectActiveRooms(), []);
  useEffect(() => props.connectUserRooms(props.userId), [props.userId]);

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

function Wrapper (props: IHomePageProps) {
  const [working, setWorking] = useState(false);
  const [ready, setReady] = useState(false);

  if (!working) {
    // no need to unsubscribe
    connectActiveRooms(store, () => setReady(true));
    setWorking(true);
  }

  if (!ready) {
    return (
      <LoadingView/>
    );
  }

  return (
    <HomePage {...props} />
  );
}

export default connect(
  (state: IState) => ({
    activeRooms: Rooms.pickActiveRooms(state),
    firebaseUser: state.currentUser0.firebaseUser,
    loggedIn: state.currentUser.loggedIn,
    userId: state.currentUser.id,
    userProfile: state.currentUser0.profile,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: Dispatch) => ({
    connectActiveRooms: () => Rooms.connectActiveRooms(
      (rooms) => dispatch(Rooms.setActiveRooms(rooms)),
      (error) => dispatch(ErrorLogs.add('connect active rooms', error)),
    ),
    connectUserRooms: (userId: string) => Rooms.connectUserRooms(
      userId,
      (rooms) => dispatch(Rooms.setUserRooms(rooms)),
      (error) => dispatch(ErrorLogs.add('connect user rooms', error)),
    ),
  }),
)(Wrapper);

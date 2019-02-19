import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';
import { loadActiveRooms, loadOwnRooms } from '../rooms';

interface IHomePageProps {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  userName: string;
}

const AppName = styled.h1`
  text-align: center;
`;

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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      <AppName>Hello Home World!</AppName>
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
            Welcome back, {props.userName}!
            <Link to="/login">Log out...</Link>
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
    </div>
  );
}

const mapStateToProps = (state: IState) => ({
  firebaseUser: state.currentUser.firebaseUser,
  loggedIn: state.currentUser.loggedIn,
  userName: state.currentUser.name,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

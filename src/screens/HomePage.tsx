import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';
import { loadActiveRooms } from '../rooms';

interface IHomePageProps {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  setRooms: (rooms: IRoom[]) => void;
  userName: string;
}

const AppName = styled.h1`
  text-align: center;
`;

interface IHomePageState {
  ready: boolean;
  rooms: IRoom[];
}

function HomePage (props: IHomePageProps) {
  const [state, setState] = useState<IHomePageState>({
    ready: !props.firebaseUser,
    rooms: [],
  });

  if (props.firebaseUser && !state.ready) {
    loadActiveRooms(props.firebaseUser)
      .then((rooms) => {
        props.setRooms(rooms);
        setState({
          ...state,
          ready: true,
          rooms,
        });
      })
      .catch((error) => {
        console.error(error);
      });
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
      {props.loggedIn ? (
        <>
          <p>
            Welcome back, {props.userName}!
            <Link to="/login">Log out...</Link>
          </p>
          <ul>
            {state.rooms.map((room) => (
              <li key={room.id}>
                <Link to={`/rooms/${room.id}`}>{room.name || '(no name)'}</Link>
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
  setRooms: (rooms: IRoom[]) => dispatch({
    rooms,
    type: RoomsActionTypes.setRooms,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

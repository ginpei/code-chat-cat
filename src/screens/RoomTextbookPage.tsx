import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { headerHeight } from '../basics/Header';
import RoomHeader from '../basics/RoomHeader';
import TextbookContent from '../basics/TextbookContent';
import Container from '../independents/Container';
import LoadingView from '../independents/LoadingView';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import NotFoundPage from './NotFoundPage';

const TextbookContainer = styled.div`
  height: calc(100vh - ${headerHeight}px);
  overflow-y: scroll;
`;
const TextbookWrapper = styled(Container)`
  background-color: snow;
  box-shadow: 0 0 10px #0003;
  min-height: 100%;
  padding: 0.01px 1rem;
`;

interface IRoomTextbookPageParams {
  id: string;
}
interface IRoomTextbookPageProps
  extends RouteComponentProps<IRoomTextbookPageParams> {
  pickRoom: (roomId: string) => Rooms.IRoom;
  userProfile: Profiles.IProfile | null;
  saveError: (location: string, error: ErrorLogs.AppError) => void;
}

function RoomTextbookPage (props: IRoomTextbookPageProps) {
  const roomId = props.match.params.id;
  const initialRoom = Rooms.emptyRoom;

  const [room, setRoom] = useState<Rooms.IRoom | null>(
    props.pickRoom(roomId) || initialRoom,
  );
  useEffect(() => Rooms.connectRoom(
    roomId,
    (v) => setRoom(v),
    (error) => {
      setRoom(null);
      props.saveError('connect room', error);
    },
  ), [roomId]);

  if (room === initialRoom) {
    return (
      <LoadingView/>
    );
  }

  if (!room) {
    return (
      <NotFoundPage/>
    );
  }

  return (
    <div>
      <RoomHeader
        fullscreen={true}
        room={room}
        userProfile={props.userProfile}
      />
      <TextbookContainer>
        <TextbookWrapper>
          <TextbookContent content={room.textbookContent} />
        </TextbookWrapper>
      </TextbookContainer>
    </div>
  );
}

export default connect(
  (state: AppState) => ({
    pickRoom: (roomId: string) => Rooms.pickRoom(state, roomId),
    userProfile: state.currentUser.profile,
  }),
  (dispatch: AppDispatch) => ({
    saveError: (location: string, error: ErrorLogs.AppError) =>
      dispatch(ErrorLogs.add(location, error)),
  }),
)(RoomTextbookPage);

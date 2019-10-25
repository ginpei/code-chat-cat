import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { headerHeight } from '../basics/Header';
import RoomHeader from '../basics/RoomHeader';
import RoomTextbookSidebarArchived from '../basics/RoomTextbookSidebarArchived';
import TextbookContent from '../basics/TextbookContent';
import RoomTextbookSidebar from '../complexes/RoomTextbookSidebar';
import Container from '../independents/Container';
import LoadingView from '../independents/LoadingView';
import { setTitle } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import NotFoundPage from './NotFoundPage';

const TextbookContainer = styled.div`
  display: flex;
  height: calc(100vh - ${headerHeight}px);
  overflow: hidden;
`;

const sidebarWidth = 300;

const SidebarFrame = styled.div`
  background-color: #f9f9f9;
  border-right: solid 0.2rem #036;
  box-shadow: 0px 0 10px #0003;
  overflow-y: scroll;
  padding: 1rem;
  width: ${sidebarWidth}px;
`;

const MainFrame = styled.div`
  overflow-y: scroll;
  width: 100%;
`;

const TextbookWrapper = styled(Container)`
  background-color: snow;
  box-shadow: 0 0 10px #0003;
  min-height: 100%;
  padding: 0.01px 1rem;
`;

interface PageParams {
  id: string;
}

type StateProps = {
  pickRoom: (roomId: string) => Rooms.Room;
  userProfile: Profiles.Profile | null;
};

type DispatchProps = {
  saveError: (location: string, error: ErrorLogs.AppError) => void;
  storeRoom: (room: Rooms.Room) => void;
};

type Props =
  & RouteComponentProps<PageParams>
  & StateProps
  & DispatchProps;

function RoomTextbookPage (props: Props) {
  const { saveError, storeRoom } = props;
  const roomId = props.match.params.id;
  const initialRoom = Rooms.emptyRoom;

  const [room, setRoom] = useState<Rooms.Room | null>(
    props.pickRoom(roomId) || initialRoom,
  );
  useEffect(() => Rooms.connectRoom(
    roomId,
    (v) => {
      setRoom(v);
      if (v) {
        storeRoom(v);
      }
    },
    (error) => {
      setRoom(null);
      saveError('connect room', error);
    },
  ), [roomId, storeRoom, saveError]);

  const roomName = room ? room.name : '';
  useEffect(() => {
    setTitle(roomName || '...');
  }, [roomName]);

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
        <SidebarFrame>
          {room.status === Rooms.RoomStatus.archived ? (
            <RoomTextbookSidebarArchived room={room} />
          ) : (
            <RoomTextbookSidebar room={room} />
          )}
        </SidebarFrame>
        <MainFrame>
          <TextbookWrapper>
            <TextbookContent content={room.textbookContent} />
          </TextbookWrapper>
        </MainFrame>
      </TextbookContainer>
    </div>
  );
}

export default connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    pickRoom: (roomId: string) => Rooms.pickRoom(state, roomId),
    userProfile: state.currentUser.profile,
  }),
  (dispatch: AppDispatch) => ({
    saveError: (location: string, error: ErrorLogs.AppError) => dispatch(
      ErrorLogs.add(location, error),
    ),
    storeRoom: (room: Rooms.Room) => dispatch(Rooms.storeRoom(room)),
  }),
)(RoomTextbookPage);

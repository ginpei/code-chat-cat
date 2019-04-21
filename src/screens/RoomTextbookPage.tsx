import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { headerHeight } from '../basics/Header';
import RoomHeader from '../basics/RoomHeader';
import TextbookContent from '../basics/TextbookContent';
import DefaultLayout from '../complexes/DefaultLayout';
import Container from '../independents/Container';
import LoadingView from '../independents/LoadingView';
import { store } from '../misc';
import { connectActiveRooms } from '../models/rooms';
import { IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IRoom } from '../reducers/rooms';

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
  activeRooms: IRoom[];
  userProfile: IUserProfile | null;
  userRooms: IRoom[];
}

class RoomTextbookPage extends React.Component<IRoomTextbookPageProps> {
  protected get roomId () {
    return this.props.match.params.id;
  }

  protected get room () {
    return (
      this.props.activeRooms.find((v) => v.id === this.roomId) ||
      this.props.userRooms.find((v) => v.id === this.roomId)
    );
  }

  public render () {
    const { room } = this;

    if (!room) {
      return (
        <DefaultLayout>
          <h1>Room not found</h1>
        </DefaultLayout>
      );
    }

    return (
      <div>
        <RoomHeader
          fullscreen={true}
          room={room}
          userProfile={this.props.userProfile}
        />
        <TextbookContainer>
          <TextbookWrapper>
            <TextbookContent content={room.textbookContent} />
          </TextbookWrapper>
        </TextbookContainer>
      </div>
    );
  }
}

function Wrapper (props: IRoomTextbookPageProps) {
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
    <RoomTextbookPage {...props} />
  );
}

export default connect(
  (state: IState) => ({
    activeRooms: state.rooms.activeRooms,
    userProfile: state.currentUser0.profile,
    userRooms: state.rooms.userRooms,
  }),
)(Wrapper);

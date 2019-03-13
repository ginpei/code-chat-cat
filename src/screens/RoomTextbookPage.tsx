import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../basics/Container';
import LoadingView from '../basics/LoadingView';
import Markdown from '../basics/Markdown';
import Header, { headerHeight } from '../components/Header';
import DefaultLayout from '../containers/DefaultLayout';
import { store } from '../misc';
import { connectActiveRooms } from '../models/rooms';
import { Dispatch, IState } from '../reducers';
import { IRoom } from '../reducers/rooms';

const TextbookContainer = styled.div`
  height: calc(100vh - ${headerHeight}px);
  overflow-y: scroll;
`;
const TextbookContent = styled(Container)`
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
        <Header
          fullscreen={true}
          title={room.name}
          titleHref={`/rooms/${this.roomId}`}
        />
        <TextbookContainer>
          <TextbookContent>
            <Markdown content={room.textbookContent} />
          </TextbookContent>
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
    userRooms: state.rooms.userRooms,
  }),
)(Wrapper);

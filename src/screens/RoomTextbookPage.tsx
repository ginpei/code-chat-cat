import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../basics/Container';
import LoadingView from '../basics/LoadingView';
import RoomTaskBlock from '../basics/RoomTaskBlock';
import { headerHeight } from '../components/Header';
import RoomHeader from '../components/RoomHeader';
import TextbookContent from '../components/TextbookContent';
import DefaultLayout from '../containers/DefaultLayout';
import { store } from '../misc';
import { connectActiveRooms } from '../models/rooms';
import { IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IRoom } from '../reducers/rooms';

const BodyGrid = styled.div`
  display: grid;
  grid-template:
    "sidebar textbook" calc(100vh - ${headerHeight}px)
    / minmax(15rem, 20%) 1fr;
`;
const BodyGridItem = styled.div`
  overflow-y: scroll;
  overflow-x: auto;
`;
const Sidebar = styled(BodyGridItem)`
  padding: 0 1rem;
`;
const TextbookContainer = styled(Container)`
  background-color: snow;
  box-shadow: 0 0 10px #0003;
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

    const onModifyClick = () => {
      const name = window.prompt('Your name?', 'Ginpei');
      if (name) {
        console.log('# name', name);
      }
    };

    const tasks = [
      {
        closed: true,
        id: '100',
        mdContent: `
1. \`npm install ...\` でインストール
2. \`.eslintrc.js\` 作成
3. \`npx eslint .\` で実行`.trim(),
        title: 'ESLint導入',
      },
      {
        closed: false,
        id: '101',
        mdContent: `\
3. npm scripts へ記述`.trim(),
        title: 'ESLint用スクリプト',
      },
    ];

    return (
      <div>
        <RoomHeader
          fullscreen={true}
          room={room}
          userProfile={this.props.userProfile}
        />
        <BodyGrid>
          <Sidebar>
            <h1>Profile</h1>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{'Ginpei'}</td>
                </tr>
              </tbody>
            </table>
            <p><button onClick={onModifyClick}>Modify</button></p>
            <h1>Tasks</h1>
            {tasks.map((task) => (
              <RoomTaskBlock key={task.id} {...task} />
            ))}
          </Sidebar>
          <BodyGridItem>
            <TextbookContainer>
              <TextbookContent content={room.textbookContent} />
            </TextbookContainer>
          </BodyGridItem>
        </BodyGrid>
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
    userProfile: state.currentUser.profile,
    userRooms: state.rooms.userRooms,
  }),
)(Wrapper);

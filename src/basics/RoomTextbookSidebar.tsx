import React, { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import firebase from '../middleware/firebase';
import { logInAsAnonymous } from '../models/CurrentUser';
import { useProfile, Profile } from '../models/Profiles';
import { Room } from '../models/Rooms';
import { useRoomTasks } from '../models/RoomTasks';
import RoomIndexList from './RoomIndexList';
import SidebarSection from './RoomSidebarSection';

const AnonymousSidebar: React.FC<{
  error: Error | null;
  onLogin: (profile: Profile) => void;
}> = (props) => {
  const [name, setName] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    props.onLogin({
      id: '',
      name,
    });
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setName(value);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Welcome!</h1>
      {props.error && (
        <p>Error: {props.error.message}</p>
      )}
      <p>
        {'Name: '}
        <input type="text" value={name} onChange={onNameChange}/>
      </p>
      <p>
        <button type="submit">Start</button>
      </p>
    </form>
  );
};

const UserInfoSection: React.FC<{
  profile: Profile,
  onProfileChange: (profile: Profile) => void,
}> = (props) => {
  const { name } = props.profile;

  const onNameChangeClick = () => {
    const newName = window.prompt('You name', name);
    if (newName) {
      props.onProfileChange({ ...props.profile, name: newName });
    }
  };

  return (
    <div className="UserInfoSection">
      <p>
        <button onClick={onNameChangeClick} style={{ float: 'right' }}>✒</button>
        {`Name: ${name || 'Anonymous'}`}
      </p>
    </div>
  );
};

const TextbookTasksSection: React.FC<{ room: Room }> = (props) => {
  const { room } = props;
  const [tasks, tasksInitialized, tasksError] = useRoomTasks(
    firebase.firestore(),
    room.id,
  );

  if (tasksError) {
    return (
      <div>Error: {tasksError.message || '(Unknown)'}</div>
    );
  }

  if (!tasksInitialized) {
    return (
      <div>…</div>
    );
  }

  return (
    <div>
      {tasks.length < 1 && (
        <p>(No tasks)</p>
      )}
      {tasks.map((task) => (
        <div key={task.id}>
          {task.title}
        </div>
      ))}
    </div>
  );
};

const RoomTextbookSidebarOuter = styled.div`
  padding-bottom: 5em;
`;

const RoomTextbookSidebar: React.FC<{ room: Room }> = ({ room }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);

  const [profile, profileInitialized, profileError] = useProfile(
    firebase.auth(),
    firebase.firestore(),
  );

  const onLogin = async (newProfile: Profile) => {
    try {
      setLoggingIn(true);
      await logInAsAnonymous(
        firebase.auth(),
        firebase.firestore(),
        newProfile,
      );
    } catch (err) {
      console.error(err);
      setLoginError(err);
    } finally {
      setLoggingIn(false);
    }
  };

  const onProfileChange = async (newProfile: Profile) => {
    // TODO
    console.log('# newProfile', newProfile);
  };

  if (profileError) {
    return (
      <div>
        {profileError.message}
      </div>
    );
  }

  if (!profileInitialized) {
    return (
      <div>…</div>
    );
  }

  if (loggingIn) {
    return (
      <p>Logging in...</p>
    );
  }

  if (!profile) {
    return (
      <AnonymousSidebar
        error={loginError}
        onLogin={onLogin}
      />
    );
  }

  return (
    <RoomTextbookSidebarOuter className="RoomTextbookSidebar">
      <SidebarSection heading="You" open>
        <UserInfoSection
          profile={profile}
          onProfileChange={onProfileChange}
        />
      </SidebarSection>
      <SidebarSection heading="Index">
        <RoomIndexList room={room} />
      </SidebarSection>
      <SidebarSection heading="Tasks">
        <TextbookTasksSection room={room} />
      </SidebarSection>
    </RoomTextbookSidebarOuter>
  );
};

export default RoomTextbookSidebar;

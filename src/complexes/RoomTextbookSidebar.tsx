import React, { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import firebase from '../middleware/firebase';
import { logInAsAnonymous } from '../models/CurrentUser';
import {
  Profile, ProfileType, saveProfile2, useProfile,
} from '../models/Profiles';
import { Room } from '../models/Rooms';
import RoomIndexList from '../basics/RoomIndexList';
import SidebarSection from '../basics/RoomSidebarSection';
import TextbookTasksSection from './TextbookTasksSection';

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
      type: ProfileType.anonymous,
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

const RoomTextbookSidebarOuter = styled.div`
  padding-bottom: 5em;
`;

const RoomTextbookSidebar: React.FC<{ room: Room }> = ({ room }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [, setSavingProfile] = useState(false);

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
      setError(err);
    } finally {
      setLoggingIn(false);
    }
  };

  const onProfileChange = async (newProfile: Profile) => {
    try {
      setSavingProfile(true);
      saveProfile2(firebase.firestore(), newProfile);
      setSavingProfile(false);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoggingIn(false);
    }
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
        error={error}
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

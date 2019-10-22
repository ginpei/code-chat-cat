import React, { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import RoomIndexList from '../basics/RoomIndexList';
import SidebarSection from '../basics/RoomSidebarSection';
import firebase from '../middleware/firebase';
import { logInAsAnonymous, logOut2 } from '../models/CurrentUser';
import {
  Profile, ProfileType, saveProfile2, useProfile,
} from '../models/Profiles';
import {
  logInToRoom, Room, RoomStudent, useRoomStudents,
} from '../models/Rooms';
import TextbookTasksSection from './TextbookTasksSection';

const GuestSidebar: React.FC<{
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
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [, setSavingProfile] = useState(false);
  const [students, studentsInitialized, studentsError] = useRoomStudents(
    firebase.firestore(),
    room,
  );

  const [profile, profileInitialized, profileError] = useProfile(
    firebase.auth(),
    firebase.firestore(),
  );

  const onLogin = async (newProfile: Profile) => {
    try {
      setLoggingIn(true);
      let studentProfile = newProfile;
      if (!studentProfile.id) {
        studentProfile = await logInAsAnonymous(
          firebase.auth(),
          firebase.firestore(),
          newProfile,
        );
      }
      await logInToRoom(
        firebase.firestore(),
        room,
        studentProfile,
      );
    } catch (err) {
      console.error(err);
      setLoginError(err);
      logOut2(firebase.auth());
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
      setLoginError(err);
    } finally {
      setLoggingIn(false);
    }
  };

  const error = loginError || profileError || studentsError;
  if (error) {
    return (
      <div>
        {error.message}
      </div>
    );
  }

  if (!profileInitialized || !studentsInitialized) {
    return (
      <div>…</div>
    );
  }

  if (loggingIn) {
    return (
      <p>Logging in...</p>
    );
  }

  if (!profile || !hasStudentsLoggedIn(students, profile)) {
    return (
      <GuestSidebar
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

function hasStudentsLoggedIn(students: RoomStudent[], profile: Profile) {
  return students.some((v) => v.id === profile.id);
}

export default RoomTextbookSidebar;

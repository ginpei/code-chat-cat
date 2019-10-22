import React, { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import RoomIndexList from '../basics/RoomIndexList';
import SidebarSection from '../basics/RoomSidebarSection';
import SimpleError from '../independents/SimpleError';
import firebase from '../middleware/firebase';
import { logInAsAnonymous, logOut2 } from '../models/CurrentUser';
import { Profile, useProfile } from '../models/Profiles';
import {
  Room, RoomStudent, saveRoomStudent, useRoomStudent,
} from '../models/Rooms';
import TextbookTasksSection from './TextbookTasksSection';

const GuestSidebar: React.FC<{
  error: Error | null;
  onLogin: (profile: Profile) => void;
  profile: Profile | null;
}> = (props) => {
  const { error, profile } = props;
  const [name, setName] = useState(profile ? profile.name : '');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    props.onLogin({
      id: props.profile ? props.profile.id : '',
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
      {error && (
        <SimpleError error={error} />
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
  student: RoomStudent,
  onProfileChange: (student: RoomStudent) => void,
}> = (props) => {
  const { name } = props.student;

  const onNameChangeClick = () => {
    const newName = window.prompt('You name', name);
    if (newName) {
      props.onProfileChange({ ...props.student, name: newName });
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
  const { currentUser } = firebase.auth();

  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [, setSavingProfile] = useState(false);

  const [profile, profileInitialized, profileError] = useProfile(
    firebase.auth(),
    firebase.firestore(),
  );

  const [student, studentInitialized, studentError] = useRoomStudent(
    firebase.firestore(),
    room,
    currentUser ? currentUser.uid : '',
  );

  const onLogin = async (newProfile: Profile) => {
    try {
      setLoggingIn(true);
      let studentProfile = newProfile;
      if (!studentProfile.id && !newProfile.id) {
        studentProfile = await logInAsAnonymous(
          firebase.auth(),
          firebase.firestore(),
          newProfile,
        );
      }
      await saveRoomStudent(
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

  const onProfileChange = async (newStudent: RoomStudent) => {
    try {
      setSavingProfile(true);
      saveRoomStudent(firebase.firestore(), room, newStudent);
      setSavingProfile(false);
    } catch (err) {
      console.error(err);
      setLoginError(err);
    } finally {
      setLoggingIn(false);
    }
  };

  const isOwner = profile
    ? profile.id === room.userId
    : false;

  const error = loginError || profileError || studentError;
  if (error) {
    return (
      <SimpleError error={error} />
    );
  }

  if (!profileInitialized || !studentInitialized) {
    return (
      <div>…</div>
    );
  }

  if (loggingIn) {
    return (
      <p>Logging in...</p>
    );
  }

  if (!isOwner && !student) {
    return (
      <GuestSidebar
        error={loginError}
        onLogin={onLogin}
        profile={profile}
      />
    );
  }

  return (
    <RoomTextbookSidebarOuter className="RoomTextbookSidebar">
      <SidebarSection heading="You" open>
        {isOwner ? (
          <p>{profile!.name} (Owner)</p>
        ) : (
          <UserInfoSection
            student={student!}
            onProfileChange={onProfileChange}
          />
        )}
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../complexes/DefaultLayout';
import LoadingView from '../independents/LoadingView';
import firebase from '../middleware/firebase';
import { setTitle } from '../misc';
import * as Profiles from '../models/Profiles';
import path from '../path';

const ProfileForm: React.FC<{
  onSubmit: (profile: Profiles.Profile) => Promise<void>;
  profile: Profiles.Profile,
}> = (props) => {
  const { profile } = props;
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState(profile.name);

  const onProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProfile: Profiles.Profile = {
      ...profile!,
      name: userName,
    };

    setSaving(true);
    await props.onSubmit(newProfile);
    setSaving(false);
  };

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };

  return (
    <form onSubmit={onProfileSubmit}>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>
              <input
                readOnly={true}
                type="text"
                value={profile.id}
              />
            </td>
          </tr>
          <tr>
            <th>Name</th>
            <td>
              <input
                disabled={saving}
                onChange={onUserNameChange}
                type="text"
                value={userName}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        disabled={saving}
      >
      Save
      </button>
    </form>
  );
};

const SettingsPage: React.FC = () => {
  setTitle('Settings');

  const [profile, profileInitialized, profileError] = Profiles.useProfile(
    firebase.auth(),
    firebase.firestore(),
  );

  const onProfileSubmit = async (newProfile: Profiles.Profile) => {
    await Profiles.saveProfile(newProfile);
  };

  if (profileError) {
    // TODO make component
    return (
      <div>
        <h1>Error</h1>
        {profileError.message}
      </div>
    );
  }

  if (!profileInitialized) {
    return (
      <LoadingView />
    );
  }

  if (!firebase.auth().currentUser || !profile) {
    return (
      <DefaultLayout>
        <p>
          <Link to={path('login')}>Login</Link>
        </p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <h1>Settings</h1>
      <section>
        <h2>Profile</h2>
        <ProfileForm
          onSubmit={onProfileSubmit}
          profile={profile}
        />
      </section>
    </DefaultLayout>
  );
};

export default SettingsPage;

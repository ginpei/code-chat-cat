import React from 'react';
import DefaultLayout from '../components/DefaultLayout';
import * as currentUser from '../currentUser';
import { appHistory } from '../misc';

export default function LogoutPage () {
  Promise.all([
    currentUser.logOut(),
    new Promise((f) => setTimeout(f, 300)),
  ])
    .then(() => appHistory.push('/'));

  return (
    <DefaultLayout>
      <p>Logging out...</p>
    </DefaultLayout>
  );
}

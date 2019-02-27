import React, { useState } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import * as users from '../models/users';
import { HomeLink } from '../path';

export default function LogoutPage () {
  const [done, setDone] = useState(false);

  users.logOut()
    .then(() => setDone(true));

  return (
    <DefaultLayout>

      {done ? (
        <>
          <h1>Logged out ✓</h1>
          <p><HomeLink/></p>
        </>
      ) : (
        <p>Logging out...</p>
      )}
    </DefaultLayout>
  );
}

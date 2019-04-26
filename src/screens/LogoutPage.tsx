import React, { useState } from 'react';
import DefaultLayout from '../complexes/DefaultLayout';
import * as CurrentUser from '../models/CurrentUser';
import { HomeLink } from '../path';

export default function LogoutPage () {
  const [done, setDone] = useState(false);

  if (!done) {
    CurrentUser.logOut()
      .then(() => setDone(true));
  }

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

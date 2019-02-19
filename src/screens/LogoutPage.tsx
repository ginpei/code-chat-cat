import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import * as currentUser from '../currentUser';

export default function LogoutPage () {
  const [done, setDone] = useState(false);

  currentUser.logOut()
    .then(() => setDone(true));

  return (
    <DefaultLayout>
      {done ? (
        <>
          <h1>Logged out ✓</h1>
          <p><Link to="/">Back to Home</Link></p>
        </>
      ) : (
        <p>Logging out...</p>
      )}
    </DefaultLayout>
  );
}

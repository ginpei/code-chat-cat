import React from 'react';
import Container from '../components/Container';
import Header from '../components/Header';
import * as currentUser from '../currentUser';
import { appHistory } from '../misc';

export default function LogoutPage () {
  Promise.all([
    currentUser.logOut(),
    new Promise((f) => setTimeout(f, 300)),
  ])
    .then(() => appHistory.push('/'));

  return (
    <div>
      <Header/>
      <Container>
        <p>Logging out...</p>
      </Container>
    </div>
  );
}

import React from 'react';
import Container from '../components/Container';
import Header from '../components/Header';

export default function DefaultLayout (props: any) {
  return (
    <div>
      <Header
        menus={[
          // TODO replace these dummy values
          {
            links: [
              { title: 'Twitter', href: '/' },
              { title: 'Facebook', href: '/' },
            ],
            name: 'SNS',
          },
          {
            links: [
              { title: 'Login', href: '/login' },
              { title: 'Logout', href: '/logout' },
            ],
            name: 'Account',
        },
        ]}
      />
      <Container>{props.children}</Container>
    </div>
  );
}

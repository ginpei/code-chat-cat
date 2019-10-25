import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Footer from '../basics/Footer';
import Header, { headerHeight } from '../basics/Header';
import { HeaderMenuGroup } from '../basics/HeaderMenu';
import Container from '../independents/Container';
import * as Profiles from '../models/Profiles';
import { AppState } from '../models/Store';
import path from '../path';

export const MainContainer = styled(Container)`
  min-height: calc(100vh - ${headerHeight}px - 10rem);
`;

interface Props {
  children: React.ReactNode;
  userProfile: Profiles.Profile | null;
}

export function DefaultLayout (props: Props) {
  const menus = getDefaultHeaderMenu(props.userProfile);

  return (
    <div>
      <Header menus={menus} />
      <MainContainer>{props.children}</MainContainer>
      <Footer/>
    </div>
  );
}

export function getDefaultHeaderMenu (profile: Profiles.Profile | null) {
  if (profile) {
    return getLoggedInMenu(profile);
  } else {
    return getAnonymousMenu();
  }
}

function getLoggedInMenu (profile: Profiles.Profile): HeaderMenuGroup[] {
  return [
    {
      links: [
        { title: 'List', href: path('room-list') },
        { title: 'Create new', href: path('room-new') },
      ],
      name: 'Rooms',
    },
    {
      links: [
        { title: 'Settings', href: path('settings') },
        { title: 'Log out', href: path('logout') },
      ],
      name: profile.name,
    },
  ];
}

function getAnonymousMenu (): HeaderMenuGroup[] {
  return [
    {
      links: [
        { title: 'Log in', href: path('login') },
      ],
      name: 'Account',
    },
  ];
}

export default connect(
  (state: AppState) => ({
    userProfile: state.currentUser.profile,
  }),
)(DefaultLayout);

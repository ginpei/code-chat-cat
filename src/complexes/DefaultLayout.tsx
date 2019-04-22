import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Footer from '../basics/Footer';
import Header, { headerHeight } from '../basics/Header';
import { IHeaderMenu } from '../basics/HeaderMenu';
import Container from '../independents/Container';
import path from '../path';
import { IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';

export const MainContainer = styled(Container)`
  min-height: calc(100vh - ${headerHeight}px - 10rem);
`;

interface IDefaultLayoutProps {
  children: React.ReactNode;
  userProfile: IUserProfile | null;
}

export function DefaultLayout (props: IDefaultLayoutProps) {
  const menus = getDefaultHeaderMenu(props.userProfile);

  return (
    <div>
      <Header menus={menus} />
      <MainContainer>{props.children}</MainContainer>
      <Footer/>
    </div>
  );
}

export function getDefaultHeaderMenu (profile: IUserProfile | null) {
  if (profile) {
    return getLoggedInMenu(profile);
  } else {
    return getAnonymousMenu();
  }
}

function getLoggedInMenu (profile: IUserProfile): IHeaderMenu[] {
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

function getAnonymousMenu (): IHeaderMenu[] {
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
  (state: IState) => ({
    userProfile: state.currentUser0.profile,
  }),
)(DefaultLayout);
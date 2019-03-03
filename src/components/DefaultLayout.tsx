import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Header, { headerHeight } from '../components/Header';
import path from '../path';
import { Dispatch, IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IHeaderMenu } from './HeaderMenu';

const MainContainer = styled(Container)`
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

const mapStateToProps = (state: IState) => ({
  userProfile: state.currentUser.profile,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);

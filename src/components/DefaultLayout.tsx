import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Header, { headerHeight } from '../components/Header';
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

function DefaultLayout (props: IDefaultLayoutProps) {
  const menus = props.userProfile
    ? getLoggedInMenu(props.userProfile.name)
    : getAnonymousMenu();

  return (
    <div>
      <Header menus={menus} />
      <MainContainer>{props.children}</MainContainer>
      <Footer/>
    </div>
  );
}

function getLoggedInMenu (userName: string): IHeaderMenu[] {
  return [
    {
      links: [
        { title: 'List', href: '/rooms' },
        { title: 'Create new', href: '/rooms/new' },
      ],
      name: 'Rooms',
    },
    {
      links: [
        { title: 'Settings', href: '/settings' },
        { title: 'Log out', href: '/logout' },
      ],
      name: userName,
    },
  ];
}

function getAnonymousMenu (): IHeaderMenu[] {
  return [
    {
      links: [
        { title: 'Log in', href: '/login' },
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

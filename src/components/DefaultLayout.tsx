import React from 'react';
import { connect } from 'react-redux';
import Container from '../components/Container';
import Header from '../components/Header';
import { Dispatch, IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IHeaderMenu } from './HeaderMenu';

interface IDefaultLayoutProps {
  userProfile: IUserProfile | null;
}

const DefaultLayout: React.StatelessComponent<
  IDefaultLayoutProps
> = (props) => {
  const menus = props.userProfile
    ? getLoggedInMenu(props.userProfile.name)
    : getAnonymousMenu();

  return (
    <div>
      <Header menus={menus} />
      <Container>{props.children}</Container>
    </div>
  );
};

function getLoggedInMenu (userName: string): IHeaderMenu[] {
  return [
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

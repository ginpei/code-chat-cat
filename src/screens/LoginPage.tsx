// tslint:disable:jsx-no-lambda

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import Header from '../components/Header';
import * as currentUser from '../currentUser';
import { appHistory } from '../misc';
import { Dispatch, IState } from '../reducers';
import { CurrentUserActionTypes } from '../reducers/currentUser';

interface ILoginPageProps {
  currentUser: any;
  setWorking: (working: boolean) => void;
  working: boolean;
}

class LoginPage extends React.Component<ILoginPageProps> {
  constructor (props: ILoginPageProps) {
    super(props);

    this.logIn = this.logIn.bind(this);
  }

  public render () {
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
                { title: 'About', href: '/' },
                { title: 'Blog', href: '/' },
              ],
              name: 'Ginpei',
            },
          ]}
        />
        <Container>
          <h1>Login</h1>
          <p><Link to="/">Home</Link></p>
          <p>name [{this.props.currentUser.name}]</p>
          <p>
            { this.props.currentUser.loggedIn
              ? <Link to="/logout">Log out</Link>
              : <button onClick={this.logIn} disabled={this.props.working} >Log in</button>
            }
          </p>
        </Container>
      </div>
    );
  }

  public async logIn () {
    this.props.setWorking(true);
    await currentUser.logIn();
    appHistory.push('/');
    this.props.setWorking(false);
  }
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser,
  working: state.currentUser.working,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setWorking: (working: boolean) => dispatch({
    type: CurrentUserActionTypes.setWorking,
    working,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

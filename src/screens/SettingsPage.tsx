// tslint:disable:jsx-no-lambda

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import * as users from '../models/users';
import { Dispatch, IState } from '../reducers';
import { CurrentUserActionTypes, ICurrentUser } from '../reducers/currentUser';

interface ISettingsPageProps {
  currentUser: ICurrentUser;
}
interface ISettingsPageState {
  savingProfile: boolean;
  userName: string;
}

class SettingsPage extends React.Component<ISettingsPageProps, ISettingsPageState> {
  constructor (props: ISettingsPageProps) {
    super(props);
    this.state = {
      savingProfile: false,
      userName: this.props.currentUser.name,
    };
    this.onProfileSubmit = this.onProfileSubmit.bind(this);
    this.onUserNameChange = this.onUserNameChange.bind(this);
  }

  public render () {
    if (!this.props.currentUser.loggedIn) {
      return (
        <DefaultLayout>
          <p>
            <Link to="/login">Login</Link>
          </p>
        </DefaultLayout>
      );
    }

    return (
      <DefaultLayout>
        <h1>Settings</h1>
        <section>
          <h2>Profile</h2>
          <form onSubmit={this.onProfileSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>
                    <input
                      readOnly={true}
                      type="text"
                      value={this.props.currentUser.firebaseUser!.uid}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>
                    <input
                      disabled={this.state.savingProfile}
                      onChange={this.onUserNameChange}
                      type="text"
                      value={this.state.userName}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              disabled={this.state.savingProfile}
            >
              Save
            </button>
          </form>
        </section>
      </DefaultLayout>
    );
  }

  public async onProfileSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({
      savingProfile: true,
    });

    await users.saveUser({
      id: this.props.currentUser.firebaseUser!.uid,
      name: this.state.userName,
    });
    this.setState({
      savingProfile: false,
    });
  }

  public onUserNameChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    const userName = el.value;
    this.setState({ userName });
  }
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

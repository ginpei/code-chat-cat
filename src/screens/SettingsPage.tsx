import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../complexes/DefaultLayout';
import * as CurrentUser from '../models/CurrentUser';
import * as Profiles from '../models/Profiles';
import * as users from '../models/users';
import path from '../path';
import { Dispatch, IState } from '../reducers';
import { ICurrentUser, IUserProfile } from '../reducers/currentUser';

interface ISettingsPageProps {
  currentUser: CurrentUser.ICurrentUserState;
  userProfile: Profiles.IProfile | null;
}
interface ISettingsPageState {
  ready: boolean;
  savingProfile: boolean;
  userName: string;
}

class SettingsPage extends React.Component<ISettingsPageProps, ISettingsPageState> {
  constructor (props: ISettingsPageProps) {
    super(props);
    this.state = {
      ready: false,
      savingProfile: false,
      userName: '',
    };
    this.onProfileSubmit = this.onProfileSubmit.bind(this);
    this.onUserNameChange = this.onUserNameChange.bind(this);
  }

  public render () {
    if (!this.props.currentUser.loggedIn) {
      return (
        <DefaultLayout>
          <p><Link to={path('login')}>Login</Link></p>
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

  public componentDidMount () {
    const wait = () => {
      if (this.props.currentUser.ready && !this.state.ready) {
        const profile = this.props.userProfile;
        this.setState({
          ready: true,
          userName: profile ? profile.name : '',
        });
      } else {
        setTimeout(() => wait, 100);
      }
    };
    wait();
  }

  public async onProfileSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({
      savingProfile: true,
    });

    // TODO update
    // await users.saveUser({
    //   ...this.props.userProfile!,
    //   name: this.state.userName,
    // });
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

export default connect(
  (state: IState) => ({
    currentUser: state.currentUser,
    userProfile: state.currentUser.profile,
  }),
)(SettingsPage);

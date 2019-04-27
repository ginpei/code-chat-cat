import { noop } from '../misc';
import * as Profiles from './Profiles';

jest.mock('firebase');

describe('Profiles', () => {
  describe('getInitialProfile()', () => {
    it('returns a profile with the given ID', () => {
      const profile = Profiles.getInitialProfile('user1');
      expect(profile.id).toBe('user1');
    });

    it('creates new instances for each', () => {
      const profile1 = Profiles.getInitialProfile('user1');
      const profile2 = Profiles.getInitialProfile('user1');
      expect(profile1).not.toBe(profile2);
    });
  });

  // TypeError: userRef.onSnapshot is not a function
  // https://github.com/soumak77/firebase-mock/issues/115
  // describe('connectProfile', () => {
  //   it('connects', (done) => {
  //     expect.assertions(1);
  //     Profiles.connectProfile(
  //       'user1',
  //       (profile) => {
  //         expect(1).toBe(1);
  //         done();
  //       },
  //     );
  //   });
  // });
});

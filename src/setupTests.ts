import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new EnzymeAdapter() });

jest.mock('./middleware/firebase', () => {
  // eslint-disable-next-line global-require
  const firebaseMock = require('firebase-mock'); // no types are defined
  const firebase = new firebaseMock.MockFirebaseSdk();

  if (!firebase.firestore.Timestamp) {
    // tslint:disable-next-line:only-arrow-functions no-empty
    firebase.firestore.Timestamp = function Timestamp () {
      return {
        toDate: () => new Date(),
        toMillis: () => 0,
      };
    } as any;
    firebase.firestore.Timestamp.now = () => ({}) as any;
  }

  return firebase;
});

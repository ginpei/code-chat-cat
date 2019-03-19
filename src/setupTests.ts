import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new EnzymeAdapter() });

jest.mock('./middleware/firebase', () => {
  const firebaseMock = require('firebase-mock');
  return new firebaseMock.MockFirebaseSdk();
});

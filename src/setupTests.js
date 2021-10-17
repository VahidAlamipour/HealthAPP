import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import localstorageMock from 'jest-localstorage-mock';

configure({ adapter: new Adapter() });

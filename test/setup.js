import { JSDOM } from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const { document } = (new JSDOM('')).window;

configure({ adapter: new Adapter() });

global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.URL = {
  createObjectURL: () => 'Img Url Mock',
  revokeObjectURL: () => null,
};

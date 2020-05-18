import '@brainhubeu/react-file-input/dist/react-file-input.css';
import './styles/file-input.scss';

const { default: FileInput } = (() => {
  if (!global.window) {
    global.window = {};
  }
  if (process.env.GATSBY_DEVELOPMENT_MODE === 'local') {
    console.log('connecting with local react-file-input source code');
    return require('../../src');
  } else {
    console.log('connecting with @brainhubeu/react-file-input installed in node_modules');
    return require('@brainhubeu/react-file-input');
  }
})();


export { FileInput };

import { findMimeType } from './mime';

const getNameAndExtension = filename => {
  const nameParts = filename.split('.');

  if (nameParts.length <= 1 || !nameParts[0]) {
    return [filename, ''];
  }

  return [nameParts.slice(0, -1).join('.'), nameParts[nameParts.length - 1]];
};

const addPropsToFile = file => {
  const { name } = file;

  const [filename, extension] = getNameAndExtension(name);
  const mimeType = file.type || (extension && findMimeType(extension)) || '';

  file.filename = filename;
  file.extension = extension;
  file.mimeType = mimeType;

  return file;
};

export const handleChangeEvent = event => {
  if (!event.target || !event.target.files || !event.target.files.length ) {
    return null;
  }

  // Transform FileList to array
  const fileList = [...event.target.files];

  return fileList.map(addPropsToFile);
};

export const handleDropEvent = event => {
  if (!event.dataTransfer) {
    return null;
  }

  const dataTransfer = event.dataTransfer;
  if (dataTransfer.files && dataTransfer.files.length) {
    const { files } = dataTransfer;

    return [...files].map(addPropsToFile);
  }
  if (dataTransfer.items && dataTransfer.items.length) {
    const { items } = dataTransfer;

    return [...items].map(addPropsToFile);
  }

  return null;
};

export const preventDefault = event => {
  event.preventDefault();
};

export const getClickPoint = (event, wrapper, element) => {
  const { left, top } = element.getBoundingClientRect();

  const { pageX: clickX, pageY: clickY } = event;

  // Calculate points relative to the element
  const pointX = clickX - left;
  const pointY = clickY - top;

  return { pointX, pointY };
};

import { findExtension } from './mime';

export const getImageThumbnail = file => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = event => {
    resolve(event.target.result);
  };

  reader.onerr = event => {
    reject(event);
  };
});

export const createImageFromSource = source => new Promise((resolve, reject) => {
  const image = new Image();

  image.src = source;

  image.onload = res => {
    resolve(res.target);
  };

  image.onerror = event => {
    reject(event);
  };
});

export const updateFileFromBlob = (blob, file) => {
  const { filename } = file;

  const extension = findExtension(blob.type);

  const nextFile = new File([blob], `${filename}${(extension && `.${extension}`) || ''}`, { type: blob.type });
  nextFile.filename = filename;
  nextFile.extension = extension;
  nextFile.mimeType = blob.type;

  return nextFile;
};

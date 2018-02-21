/* eslint-disable-next-line import/extensions */
import mimeDb from '../assets/mimeDb.json';

export const IMAGE_MIME_TYPE = new RegExp('^image/.*');

/**
 * Find extension or returns empty string
 * @param  {string} mimeType
 * @return {string}          Extension or empty string
 */
export const findExtension = mimeType => {
  const extensions = mimeDb[mimeType];

  if (!extensions) {
    return '';
  }

  return extensions[0];
};

/**
 * Finds mimetype by extension
 * @param  {string} extension File extension
 * @return {string}           Returns mime type or an empty string
 */
export const findMimeType = extension => {
  const mimeType = Object.entries(mimeDb)
    .find(([, extensions]) => extensions.find(ext => ext === extension) || false);

  return mimeType
    ? mimeType[0]
    : '';
};

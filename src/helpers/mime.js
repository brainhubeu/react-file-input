import mimeDb from 'mime-db';

export const IMAGE_MIME_TYPE = new RegExp('^image/.*');

/**
 * Find extension or returns empty string
 * @param  {string} mimeType
 * @return {string}          Extension or empty string
 */
export const findExtension = mimeType => {
  const mimeTypeEntry = mimeType[mimeType];

  if (!mimeTypeEntry || !mimeTypeEntry.extensions) {
    return '';
  }

  return mimeTypeEntry.extensions[0];
};

/**
 * Finds mimetype by extension
 * @param  {string} extension File extension
 * @return {string}           Returns mime type or an empty string
 */
export const findMimeType = extension => {
  const mimeType = Object.entries(mimeDb)
    .find(([, value]) => (value.extensions && !!value.extensions.find(ext => ext === extension)) || false);

  return mimeType
    ? mimeType[0]
    : '';
};

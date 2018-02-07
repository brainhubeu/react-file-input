import mimeDb from 'mime-db';

/**
 * Finds mimetype by extension
 * @param  {string} extension File extension
 * @return {string}           Returns mime type or an empty string
 */
const findMimeType = extension => {
  const mimeType = Object.entries(mimeDb)
    .find(([key, value]) => value.extensions && !!value.extensions.find(ext => ext === extension) || false);

  return mimeType
    ? mimeType[0]
    : '';
};

export default findMimeType;

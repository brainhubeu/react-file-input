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

/**
 * Finds mimetype by filename
 * @param  {string} filename Filename
 * @return {string}           Returns mime type or an empty string
 */
const findMimeTypeByFilename = filename => {
  const nameParts = filename.split('.');

  if (nameParts.length <= 1 ||!nameParts[nameParts.length -1]) {
    return '';
  }

  const extension = nameParts[nameParts.length -1];

  return findMimeType(extension);
};

export default findMimeTypeByFilename;

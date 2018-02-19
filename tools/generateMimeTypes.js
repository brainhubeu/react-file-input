/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mimeDb = require('mime-db');
const { chalkError, chalkSuccess } = require('./chalkConfig');

const DEST_FOLDER = path.resolve('./', 'src', 'assets');
const DEST_FILE = path.resolve(DEST_FOLDER, 'mimeDb.json');

const validMimeDb = Object.entries(mimeDb)
  .filter(([type, data]) => data.extensions && data.extensions.length)
  .reduce((db, [type, data]) => ({
    ...db,
    [type]: data.extensions,
  }), {});


fs.writeFile(DEST_FILE, JSON.stringify(validMimeDb, null, 2), error => {
  if (error) {
    console.log(chalkError(error));
  } else {
    console.log(chalkSuccess(`mime db created in ${DEST_FILE}`));
  }
});

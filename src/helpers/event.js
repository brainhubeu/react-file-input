export const handleChangeEvent = event => {
  if (!event.target || !event.target.files || !event.target.files.length ) {
    return null;
  }

  return event.target.files;
};

export const handleDropEvent = event => {
  if (!event.dataTransfer) {
    return null;
  }

  const dataTransfer = event.dataTransfer;
  if (dataTransfer.files && dataTransfer.files.length) {
    return dataTransfer.files;
  }
  if (dataTransfer.items && dataTransfer.items.length) {
    return dataTransfer.items;
  }

  return null;
};

export const preventDefault = event => {
  event.preventDefault();
};

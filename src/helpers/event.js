export const getDataTransfer = event => {
  if (!event.dataTransfer) {
    return null;
  }

  const dataTransfer = event.dataTransfer;
  if (dataTransfer.files && dataTransfer.files.length) {
    return dataTransfer.files[0];
  }
  if (dataTransfer.items && dataTransfer.items.length) {
    return dataTransfer.items[0];
  }

  return null;
};

export const preventDefault = event => {
  event.preventDefault();
};

export const getImageThumbnail = file => new Promise(resolve => {
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = event => {
    resolve(event.target.result);
  };
});

const dataURLtoBlob = dataurl => {
  const parts = dataurl.split(','),
    mime = parts[0].match(/:(.*?);/)[1];
  if (parts[0].indexOf('base64') !== -1) {
    let bstr = atob(parts[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  } else {
    const raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: mime });
  }
};

export default dataURLtoBlob;

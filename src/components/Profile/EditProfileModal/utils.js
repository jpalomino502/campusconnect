// utils.js
export const dataURLToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  export const convertToWebP = (file) => {
    // Logic to convert file to webp format if needed
    return file;
  };
  
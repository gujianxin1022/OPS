export const copyLink = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject();
    }
    let transfer = document.createElement("input");
    transfer.style.position = "fixed";
    transfer.style.top = "-10000px";
    transfer.style.left = "-10000px";
    document.body.appendChild(transfer);
    transfer.value = url;
    transfer.focus();
    transfer.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    transfer.blur();
    document.body.removeChild(transfer);
    resolve();
  });
};

/**
 * file或blob转base64
 * @param {*} blob file或者blob
 * @param {*} callback function (data)通过参数获得base64
 */
export const blobToBase64 = (blob, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    callback(reader.result);
  });
  reader.readAsDataURL(blob);
};

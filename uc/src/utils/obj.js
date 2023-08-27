export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getObjValue(target, path) {
  let obj = target;
  path = path.split('.');
  let index = 0;
  const length = path.length
  while (obj != null && obj != "" && index < length) {
    obj = obj[path[index++]]
  }
  return (index && index == length) ? obj : null
}

export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}


export function copyToClipboard(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject && reject();
    } else {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', typeof data == "object" ? JSON.stringif(data) : data);
      document.body.appendChild(input);
      input.select();
      if (document.execCommand('copy')) {
        resolve && resolve();
      } else {
        reject && reject();
      }
      document.body.removeChild(input);
    }
  })
}


export function getDataFromClipboard(event) {
  let c = event && event.clipboardData ? event.clipboardData : window.Clipboard;
  return c ? c.getData('Text') : "";
}
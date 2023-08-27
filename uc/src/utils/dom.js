export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector("script[src='" + src + "']")) {
      resolve && resolve();
      return;
    }
    var scriptElem = document.createElement('script');
    scriptElem.onload = function() {
      resolve && resolve();
    }
    scriptElem.onerror = function() {
      reject && reject();
    }
    scriptElem.src = src;
    document.head.appendChild(scriptElem);
  });
}

//设置光标位置
export function setCaretPosition(el, pos) {
  if (pos <= 0) {
    el.focus();
    return;
  }
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(el.childNodes.length > 0 ? el.childNodes[0] : el, pos);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}


export function downFile(resp) {
  var data = new Blob([resp.data], {
    type: 'application/octet-stream'
  });
  var a = document.createElement('a');
  a.style.display = "none";

  var fileName = resp.headers["content-disposition"].split("=");
  fileName = fileName[fileName.length - 1];
  fileName = fileName.replace(/"/g, "");
  fileName = decodeURIComponent(fileName)
  a.download = fileName;
  a.href = URL.createObjectURL(data);
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }, 0);
}

export function downloadFile(arraybuffer,name) {
  let url = window.URL.createObjectURL(new Blob([arraybuffer]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
}

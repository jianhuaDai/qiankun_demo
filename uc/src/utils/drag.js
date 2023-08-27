export default {
  dragElem: function(option) {
    var store = { move: false };
    let dragElem = option.elem[0],
      mdElem = option.elem[1],
      mmElem = option.elem[2] || mdElem,
      muElem = option.elem[3] || mmElem;

    mmElem.onmousemove = null;
    mmElem.onmouseup = null;
    mdElem.classList.add('move');
    mdElem.onmousedown = function(ev) {
      mdElem.classList.add('moving');
      store.move = true;
      store.x = ev.clientX;
      store.y = ev.clientY;
      store.left = dragElem.offsetLeft;
      store.top = dragElem.offsetTop + dragElem.scrollTop;
      mmElem.onmousemove = function(ev) {
        var posX = store.x - ev.clientX,
          posY = store.y - ev.clientY;
        if (store.move == true) {
          let l = store.left - posX,
            t = store.top - posY;
          dragElem.style.left = l + 'px';
          dragElem.style.top = t + 'px';
          option.afterMove && option.afterMove(l, t);
        }
        ev.stopPropagation();
        ev.preventDefault();
      }
      muElem.onmouseup = function(ev) {
        store.move = false;
        mdElem.classList.remove('moving');
        mdElem.releaseCapture && mdElem.releaseCapture();
        mmElem.onmousemove = null;
        muElem.onmouseup = null;
        option.mouseup && option.mouseup();
        ev.stopPropagation();
        ev.preventDefault();
      }
      mdElem.setCapture && mdElem.setCapture();
      option.mousedown && option.mousedown();
    }
  },
  destroy: function(handleElem) {
    if (handleElem) {
      if (handleElem.classList) {
        handleElem.classList.remove('move');
        handleElem.classList.remove('moving');
      }
      handleElem.onmousedown = null;
      handleElem.onmousemove = null;
      handleElem.onmouseup = null;
    }
  }
}
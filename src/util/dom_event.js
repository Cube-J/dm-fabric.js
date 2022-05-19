// since ie11 can use addEventListener but they do not support options, i need to check
var couldUseAttachEvent = !!document.createElement('div').attachEvent,
    touchEvents = ['touchstart', 'touchmove', 'touchend'];
/**
 * Adds an event listener to an element
 * @function
 * @memberOf fabric.util
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
const addListener = function(element, eventName, handler, options) {
  element && element.addEventListener(eventName, handler, couldUseAttachEvent ? false : options);
};

/**
 * Removes an event listener from an element
 * @function
 * @memberOf fabric.util
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
const removeListener = function(element, eventName, handler, options) {
  element && element.removeEventListener(eventName, handler, couldUseAttachEvent ? false : options);
};

function getTouchInfo(event) {
  var touchProp = event.changedTouches;
  if (touchProp && touchProp[0]) {
    return touchProp[0];
  }
  return event;
}

const getPointer = function(event) {
  var element = event.target,
      scroll = fabric.util.getScrollLeftTop(element),
      _evt = getTouchInfo(event);
  return {
    x: _evt.clientX + scroll.left,
    y: _evt.clientY + scroll.top
  };
};

const isTouchEvent = function(event) {
  return touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';
};
export {
  addListener,
  removeListener,
  getPointer,
  isTouchEvent,
}
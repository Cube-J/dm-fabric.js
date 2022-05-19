import { falseFunction } from './misc';

var _slice = Array.prototype.slice;

/**
 * Takes id and returns an element with that id (if one exists in a document)
 * @memberOf fabric.util
 * @param {String|HTMLElement} id
 * @return {HTMLElement|null}
 */
function getById(id) {
  return typeof id === 'string' ? document.getElementById(id) : id;
}

var sliceCanConvertNodelists,
    /**
     * Converts an array-like object (e.g. arguments or NodeList) to an array
     * @memberOf fabric.util
     * @param {Object} arrayLike
     * @return {Array}
     */
    toArray = function(arrayLike) {
      return _slice.call(arrayLike, 0);
    };

try {
  sliceCanConvertNodelists = toArray(document.childNodes) instanceof Array;
}
catch (err) { }

if (!sliceCanConvertNodelists) {
  toArray = function(arrayLike) {
    var arr = new Array(arrayLike.length), i = arrayLike.length;
    while (i--) {
      arr[i] = arrayLike[i];
    }
    return arr;
  };
}

/**
 * Creates specified element with specified attributes
 * @memberOf fabric.util
 * @param {String} tagName Type of an element to create
 * @param {Object} [attributes] Attributes to set on an element
 * @return {HTMLElement} Newly created element
 */
function makeElement(tagName, attributes) {
  var el = document.createElement(tagName);
  for (var prop in attributes) {
    if (prop === 'class') {
      el.className = attributes[prop];
    }
    else if (prop === 'for') {
      el.htmlFor = attributes[prop];
    }
    else {
      el.setAttribute(prop, attributes[prop]);
    }
  }
  return el;
}

/**
 * Adds class to an element
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to add class to
 * @param {String} className Class to add to an element
 */
function addClass(element, className) {
  if (element && (' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1) {
    element.className += (element.className ? ' ' : '') + className;
  }
}

/**
 * Wraps element with another element
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to wrap
 * @param {HTMLElement|String} wrapper Element to wrap with
 * @param {Object} [attributes] Attributes to set on a wrapper
 * @return {HTMLElement} wrapper
 */
function wrapElement(element, wrapper, attributes) {
  if (typeof wrapper === 'string') {
    wrapper = makeElement(wrapper, attributes);
  }
  if (element.parentNode) {
    element.parentNode.replaceChild(wrapper, element);
  }
  wrapper.appendChild(element);
  return wrapper;
}

/**
 * Returns element scroll offsets
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to operate on
 * @return {Object} Object with left/top values
 */
function getScrollLeftTop(element) {

  var left = 0,
      top = 0,
      docElement = document.documentElement,
      body = document.body || {
        scrollLeft: 0, scrollTop: 0
      };

  // While loop checks (and then sets element to) .parentNode OR .host
  //  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
  //  but the .parentNode of a root ShadowDOM node will always be null, instead
  //  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
  while (element && (element.parentNode || element.host)) {

    // Set element to element parent, or 'host' in case of ShadowDOM
    element = element.parentNode || element.host;

    if (element === document) {
      left = body.scrollLeft || docElement.scrollLeft || 0;
      top = body.scrollTop ||  docElement.scrollTop || 0;
    }
    else {
      left += element.scrollLeft || 0;
      top += element.scrollTop || 0;
    }

    if (element.nodeType === 1 && element.style.position === 'fixed') {
      break;
    }
  }

  return { left: left, top: top };
}

/**
 * Returns offset for a given element
 * @function
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
function getElementOffset(element) {
  var docElem,
      doc = element && element.ownerDocument,
      box = { left: 0, top: 0 },
      offset = { left: 0, top: 0 },
      scrollLeftTop,
      offsetAttributes = {
        borderLeftWidth: 'left',
        borderTopWidth:  'top',
        paddingLeft:     'left',
        paddingTop:      'top'
      };

  if (!doc) {
    return offset;
  }

  for (var attr in offsetAttributes) {
    offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
  }

  docElem = doc.documentElement;
  if ( typeof element.getBoundingClientRect !== 'undefined' ) {
    box = element.getBoundingClientRect();
  }

  scrollLeftTop = getScrollLeftTop(element);

  return {
    left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
    top: box.top + scrollLeftTop.top - (docElem.clientTop || 0)  + offset.top
  };
}

/**
 * Returns style attribute value of a given element
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to get style attribute for
 * @param {String} attr Style attribute to get for element
 * @return {String} Style attribute value of the given element.
 */
var getElementStyle;
if (document.defaultView && document.defaultView.getComputedStyle) {
  getElementStyle = function(element, attr) {
    var style = document.defaultView.getComputedStyle(element, null);
    return style ? style[attr] : undefined;
  };
}
else {
  getElementStyle = function(element, attr) {
    var value = element.style[attr];
    if (!value && element.currentStyle) {
      value = element.currentStyle[attr];
    }
    return value;
  };
}

let makeElementUnselectable, makeElementSelectable;
(function () {
  var style = document.documentElement.style,
      selectProp = 'userSelect' in style
        ? 'userSelect'
        : 'MozUserSelect' in style
          ? 'MozUserSelect'
          : 'WebkitUserSelect' in style
            ? 'WebkitUserSelect'
            : 'KhtmlUserSelect' in style
              ? 'KhtmlUserSelect'
              : '';

  /**
   * Makes element unselectable
   * @memberOf fabric.util
   * @param {HTMLElement} element Element to make unselectable
   * @return {HTMLElement} Element that was passed in
   */
  makeElementUnselectable = function(element) {
    if (typeof element.onselectstart !== 'undefined') {
      element.onselectstart = falseFunction;
    }
    if (selectProp) {
      element.style[selectProp] = 'none';
    }
    else if (typeof element.unselectable === 'string') {
      element.unselectable = 'on';
    }
    return element;
  }

  /**
   * Makes element selectable
   * @memberOf fabric.util
   * @param {HTMLElement} element Element to make selectable
   * @return {HTMLElement} Element that was passed in
   */
  makeElementSelectable = function(element) {
    if (typeof element.onselectstart !== 'undefined') {
      element.onselectstart = null;
    }
    if (selectProp) {
      element.style[selectProp] = '';
    }
    else if (typeof element.unselectable === 'string') {
      element.unselectable = '';
    }
    return element;
  }
})();

function cleanUpJsdomNode(element) {
  return;
}

function setImageSmoothing(ctx, value) {
  ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled || ctx.webkitImageSmoothingEnabled
    || ctx.mozImageSmoothingEnabled || ctx.msImageSmoothingEnabled || ctx.oImageSmoothingEnabled;
  ctx.imageSmoothingEnabled = value;
}

/**
 * setImageSmoothing sets the context imageSmoothingEnabled property.
 * Used by canvas and by ImageObject.
 * @memberOf fabric.util
 * @since 4.0.0
 * @param {HTMLRenderingContext2D} ctx to set on
 * @param {Boolean} value true or false
 */
export {
  setImageSmoothing,
  getById,
  toArray,
  addClass,
  makeElement,
  wrapElement,
  getScrollLeftTop,
  getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable
}

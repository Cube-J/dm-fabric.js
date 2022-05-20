/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */

/**
 * True when in environment that supports touch events
 * @type boolean
 */
window.isTouchSupported = 'ontouchstart' in window || 'ontouchstart' in document ||
  (window && window.navigator && window.navigator.maxTouchPoints > 0);


/* _FROM_SVG_START_ */
/**
 * Attributes parsed from all SVG elements
 * @type array
 */
window.SHARED_ATTRIBUTES = [
  'display',
  'transform',
  'fill', 'fill-opacity', 'fill-rule',
  'opacity',
  'stroke', 'stroke-dasharray', 'stroke-linecap', 'stroke-dashoffset',
  'stroke-linejoin', 'stroke-miterlimit',
  'stroke-opacity', 'stroke-width',
  'id', 'paint-order', 'vector-effect',
  'instantiated_by_use', 'clip-path',
];
/* _FROM_SVG_END_ */

/**
 * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
 */
window.DPI = 96;
window.reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)';
window.commaWsp = '(?:\\s+,?\\s*|,\\s*)';
window.rePathCommand = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/ig;
window.reNonWord = /[ \n\.,;!\?\-]/;
window.fontPaths = { };
window.iMatrix = [1, 0, 0, 1, 0, 0];
window.svgNS = 'http://www.w3.org/2000/svg';

/**
 * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
 * @since 1.7.14
 * @type Number
 * @default
 */
window.perfLimitSizeTotal = 2097152;

/**
 * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
 * @since 1.7.14
 * @type Number
 * @default
 */
window.maxCacheSideLimit = 4096;

/**
 * Lowest pixel limit for cache canvases, set at 256PX
 * @since 1.7.14
 * @type Number
 * @default
 */
window.minCacheSideLimit = 256;

/**
 * Cache Object for widths of chars in text rendering.
 */
window.charWidthsCache = { };

/**
 * if webgl is enabled and available, textureSize will determine the size
 * of the canvas backend
 * @since 2.0.0
 * @type Number
 * @default
 */
window.textureSize = 2048;

/**
 * When 'true', style information is not retained when copy/pasting text, making
 * pasted text use destination style.
 * Defaults to 'false'.
 * @type Boolean
 * @default
 */
window.disableStyleCopyPaste = false;

/**
 * Enable webgl for filtering picture is available
 * A filtering backend will be initialized, this will both take memory and
 * time since a default 2048x2048 canvas will be created for the gl context
 * @since 2.0.0
 * @type Boolean
 * @default
 */
window.enableGLFiltering = true;

/**
 * Device Pixel Ratio
 * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
 */
window.devicePixelRatio = window.devicePixelRatio ||
                          window.webkitDevicePixelRatio ||
                          window.mozDevicePixelRatio ||
                          1;
/**
 * Browser-specific constant to adjust CanvasRenderingContext2D.shadowBlur value,
 * which is unitless and not rendered equally across browsers.
 *
 * Values that work quite well (as of October 2017) are:
 * - Chrome: 1.5
 * - Edge: 1.75
 * - Firefox: 0.9
 * - Safari: 0.95
 *
 * @since 2.0.0
 * @type Number
 * @default 1
 */
window.browserShadowBlurConstant = 1;

/**
 * This object contains the result of arc to bezier conversion for faster retrieving if the same arc needs to be converted again.
 * It was an internal variable, is accessible since version 2.3.4
 */
window.arcToSegmentsCache = { };

/**
 * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
 * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
 * you do not get any speed benefit and you get a big object in memory.
 * The object was a private variable before, while now is appended to the lib so that you have access to it and you
 * can eventually clear it.
 * It was an internal variable, is accessible since version 2.3.4
 */
window.boundsOfCurveCache = { };

/**
 * If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
 * @default true
 */
window.cachesBoundsOfCurve = true;

/**
 * Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
 * Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
 * this has to be set before instantiating the filtering backend ( before filtering the first image )
 * @type Boolean
 * @default false
 */
window.forceGLPutImageData = false;

window.initFilterBackend = window.filterBackend = function() {
  if (window.enableGLFiltering && window.isWebglSupported && window.isWebglSupported(window.textureSize)) {
    console.log('max texture size: ' + window.maxTextureSize);
    return (new window.WebglFilterBackend({ tileSize: window.textureSize }));
  }
  else if (fabric.Canvas2dFilterBackend) {
    return (new fabric.Canvas2dFilterBackend());
  }
};

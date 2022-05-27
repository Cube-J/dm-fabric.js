import { util } from './util/index.js';

/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */

/**
 * True when in environment that supports touch events
 * @type boolean
 */
export const isTouchSupported = 'ontouchstart' in window || 'ontouchstart' in document ||
 (window && window.navigator && window.navigator.maxTouchPoints > 0);


/* _FROM_SVG_START_ */
/**
* Attributes parsed from all SVG elements
* @type array
*/
export const SHARED_ATTRIBUTES = [
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
export const DPI = 96;
export const reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)';
export const commaWsp = '(?:\\s+,?\\s*|,\\s*)';
export const rePathCommand = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/ig;
export const reNonWord = /[ \n\.,;!\?\-]/;
export const fontPaths = { };
export const iMatrix = [1, 0, 0, 1, 0, 0];
export const svgNS = 'http://www.w3.org/2000/svg';

/**
* Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
* @since 1.7.14
* @type Number
* @default
*/
export const perfLimitSizeTotal = 2097152;

/**
* Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
* @since 1.7.14
* @type Number
* @default
*/
export const maxCacheSideLimit = 4096;

/**
* Lowest pixel limit for cache canvases, set at 256PX
* @since 1.7.14
* @type Number
* @default
*/
export const minCacheSideLimit = 256;

/**
* Cache Object for widths of chars in text rendering.
*/
export const charWidthsCache = { };

/**
* if webgl is enabled and available, textureSize will determine the size
* of the canvas backend
* @since 2.0.0
* @type Number
* @default
*/
export const textureSize = 2048;

/**
* When 'true', style information is not retained when copy/pasting text, making
* pasted text use destination style.
* Defaults to 'false'.
* @type Boolean
* @default
*/
export let disableStyleCopyPaste = false;

/**
* Enable webgl for filtering picture is available
* A filtering backend will be initialized, this will both take memory and
* time since a default 2048x2048 canvas will be created for the gl context
* @since 2.0.0
* @type Boolean
* @default
*/
export let enableGLFiltering = true;

/**
* Device Pixel Ratio
* @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
*/
export const devicePixelRatio = window.webkitDevicePixelRatio ||
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
export const browserShadowBlurConstant = 1;

/**
* This object contains the result of arc to bezier conversion for faster retrieving if the same arc needs to be converted again.
* It was an internal variable, is accessible since version 2.3.4
*/
export const arcToSegmentsCache = { };

/**
* This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
* It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
* you do not get any speed benefit and you get a big object in memory.
* The object was a private variable before, while now is appended to the lib so that you have access to it and you
* can eventually clear it.
* It was an internal variable, is accessible since version 2.3.4
*/
export const boundsOfCurveCache = { };

/**
* If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
* @default true
*/
export let cachesBoundsOfCurve = true;

/**
* Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
* Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
* this has to be set before instantiating the filtering backend ( before filtering the first image )
* @type Boolean
* @default false
*/
export let forceGLPutImageData = false;

export const initFilterBackend = function() {
 if (enableGLFiltering && isWebglSupported && isWebglSupported(textureSize)) {
   console.log('max texture size: ' + maxTextureSize);
   return (new WebglFilterBackend({ tileSize: textureSize }));
 }
 else if (Canvas2dFilterBackend) {
   return (new Canvas2dFilterBackend());
 }
};

//-------------move webgl_backend.class.js to here ↓------------------

/**
 * Tests if webgl supports certain precision
 * @param {WebGL} Canvas WebGL context to test on
 * @param {String} Precision to test can be any of following: 'lowp', 'mediump', 'highp'
 * @returns {Boolean} Whether the user's browser WebGL supports given precision.
 */
function testPrecision(gl, precision){
  var fragmentSource = 'precision ' + precision + ' float;\nvoid main(){}';
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    return false;
  }
  return true;
}

let maxTextureSize;
/**
 * Indicate whether this filtering backend is supported by the user's browser.
 * @param {Number} tileSize check if the tileSize is supported
 * @returns {Boolean} Whether the user's browser supports WebGL.
 */
export const isWebglSupported = function(tileSize) {
  tileSize = tileSize || WebglFilterBackend.prototype.tileSize;
  var canvas = document.createElement('canvas');
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  var isSupported = false;
  // eslint-disable-next-line
  if (gl) {
    maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    isSupported = maxTextureSize >= tileSize;
    var precisions = ['highp', 'mediump', 'lowp'];
    for (var i = 0; i < 3; i++){
      if (testPrecision(gl, precisions[i])){
        window.webGlPrecision = precisions[i];
        break;
      };
    }
  }
  this.isSupported = isSupported;
  return isSupported;
};

export { maxTextureSize };

/**
 * WebGL filter backend.
 */
export function WebglFilterBackend(options) {
  if (options && options.tileSize) {
    this.tileSize = options.tileSize;
  }
  this.setupGLContext(this.tileSize, this.tileSize);
  this.captureGPUInfo();
};

WebglFilterBackend.prototype = /** @lends WebglFilterBackend.prototype */ {

  tileSize: 2048,

  /**
   * Experimental. This object is a sort of repository of help layers used to avoid
   * of recreating them during frequent filtering. If you are previewing a filter with
   * a slider you probably do not want to create help layers every filter step.
   * in this object there will be appended some canvases, created once, resized sometimes
   * cleared never. Clearing is left to the developer.
   **/
  resources: {

  },

  /**
   * Setup a WebGL context suitable for filtering, and bind any needed event handlers.
   */
  setupGLContext: function(width, height) {
    this.dispose();
    this.createWebGLCanvas(width, height);
    // eslint-disable-next-line
    this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);
    this.chooseFastestCopyGLTo2DMethod(width, height);
  },

  /**
   * Pick a method to copy data from GL context to 2d canvas.  In some browsers using
   * putImageData is faster than drawImage for that specific operation.
   */
  chooseFastestCopyGLTo2DMethod: function(width, height) {
    var canMeasurePerf = typeof window.performance !== 'undefined', canUseImageData;
    try {
      new ImageData(1, 1);
      canUseImageData = true;
    }
    catch (e) {
      canUseImageData = false;
    }
    // eslint-disable-next-line no-undef
    var canUseArrayBuffer = typeof ArrayBuffer !== 'undefined';
    // eslint-disable-next-line no-undef
    var canUseUint8Clamped = typeof Uint8ClampedArray !== 'undefined';

    if (!(canMeasurePerf && canUseImageData && canUseArrayBuffer && canUseUint8Clamped)) {
      return;
    }

    var targetCanvas = util.createCanvasElement();
    // eslint-disable-next-line no-undef
    var imageBuffer = new ArrayBuffer(width * height * 4);
    if (forceGLPutImageData) {
      this.imageBuffer = imageBuffer;
      this.copyGLTo2D = copyGLTo2DPutImageData;
      return;
    }
    var testContext = {
      imageBuffer: imageBuffer,
      destinationWidth: width,
      destinationHeight: height,
      targetCanvas: targetCanvas
    };
    var startTime, drawImageTime, putImageDataTime;
    targetCanvas.width = width;
    targetCanvas.height = height;

    startTime = window.performance.now();
    copyGLTo2DDrawImage.call(testContext, this.gl, testContext);
    drawImageTime = window.performance.now() - startTime;

    startTime = window.performance.now();
    copyGLTo2DPutImageData.call(testContext, this.gl, testContext);
    putImageDataTime = window.performance.now() - startTime;

    if (drawImageTime > putImageDataTime) {
      this.imageBuffer = imageBuffer;
      this.copyGLTo2D = copyGLTo2DPutImageData;
    }
    else {
      this.copyGLTo2D = copyGLTo2DDrawImage;
    }
  },

  /**
   * Create a canvas element and associated WebGL context and attaches them as
   * class properties to the GLFilterBackend class.
   */
  createWebGLCanvas: function(width, height) {
    var canvas = util.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    var glOptions = {
          alpha: true,
          premultipliedAlpha: false,
          depth: false,
          stencil: false,
          antialias: false
        },
        gl = canvas.getContext('webgl', glOptions);
    if (!gl) {
      gl = canvas.getContext('experimental-webgl', glOptions);
    }
    if (!gl) {
      return;
    }
    gl.clearColor(0, 0, 0, 0);
    // this canvas can fire webglcontextlost and webglcontextrestored
    this.canvas = canvas;
    this.gl = gl;
  },

  /**
   * Attempts to apply the requested filters to the source provided, drawing the filtered output
   * to the provided target canvas.
   *
   * @param {Array} filters The filters to apply.
   * @param {HTMLImageElement|HTMLCanvasElement} source The source to be filtered.
   * @param {Number} width The width of the source input.
   * @param {Number} height The height of the source input.
   * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
   * @param {String|undefined} cacheKey A key used to cache resources related to the source. If
   * omitted, caching will be skipped.
   */
  applyFilters: function(filters, source, width, height, targetCanvas, cacheKey) {
    var gl = this.gl;
    var cachedTexture;
    if (cacheKey) {
      cachedTexture = this.getCachedTexture(cacheKey, source);
    }
    var pipelineState = {
      originalWidth: source.width || source.originalWidth,
      originalHeight: source.height || source.originalHeight,
      sourceWidth: width,
      sourceHeight: height,
      destinationWidth: width,
      destinationHeight: height,
      context: gl,
      sourceTexture: this.createTexture(gl, width, height, !cachedTexture && source),
      targetTexture: this.createTexture(gl, width, height),
      originalTexture: cachedTexture ||
        this.createTexture(gl, width, height, !cachedTexture && source),
      passes: filters.length,
      webgl: true,
      aPosition: this.aPosition,
      programCache: this.programCache,
      pass: 0,
      filterBackend: this,
      targetCanvas: targetCanvas
    };
    var tempFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, tempFbo);
    filters.forEach(function(filter) { filter && filter.applyTo(pipelineState); });
    resizeCanvasIfNeeded(pipelineState);
    this.copyGLTo2D(gl, pipelineState);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(pipelineState.sourceTexture);
    gl.deleteTexture(pipelineState.targetTexture);
    gl.deleteFramebuffer(tempFbo);
    targetCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
    return pipelineState;
  },

  /**
   * Detach event listeners, remove references, and clean up caches.
   */
  dispose: function() {
    if (this.canvas) {
      this.canvas = null;
      this.gl = null;
    }
    this.clearWebGLCaches();
  },

  /**
   * Wipe out WebGL-related caches.
   */
  clearWebGLCaches: function() {
    this.programCache = {};
    this.textureCache = {};
  },

  /**
   * Create a WebGL texture object.
   *
   * Accepts specific dimensions to initialize the texture to or a source image.
   *
   * @param {WebGLRenderingContext} gl The GL context to use for creating the texture.
   * @param {Number} width The width to initialize the texture at.
   * @param {Number} height The height to initialize the texture.
   * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source for the texture data.
   * @returns {WebGLTexture}
   */
  createTexture: function(gl, width, height, textureImageSource) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (textureImageSource) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImageSource);
    }
    else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    return texture;
  },

  /**
   * Can be optionally used to get a texture from the cache array
   *
   * If an existing texture is not found, a new texture is created and cached.
   *
   * @param {String} uniqueId A cache key to use to find an existing texture.
   * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source to use to create the
   * texture cache entry if one does not already exist.
   */
  getCachedTexture: function(uniqueId, textureImageSource) {
    if (this.textureCache[uniqueId]) {
      return this.textureCache[uniqueId];
    }
    else {
      var texture = this.createTexture(
        this.gl, textureImageSource.width, textureImageSource.height, textureImageSource);
      this.textureCache[uniqueId] = texture;
      return texture;
    }
  },

  /**
   * Clear out cached resources related to a source image that has been
   * filtered previously.
   *
   * @param {String} cacheKey The cache key provided when the source image was filtered.
   */
  evictCachesForKey: function(cacheKey) {
    if (this.textureCache[cacheKey]) {
      this.gl.deleteTexture(this.textureCache[cacheKey]);
      delete this.textureCache[cacheKey];
    }
  },

  copyGLTo2D: copyGLTo2DDrawImage,

  /**
   * Attempt to extract GPU information strings from a WebGL context.
   *
   * Useful information when debugging or blacklisting specific GPUs.
   *
   * @returns {Object} A GPU info object with renderer and vendor strings.
   */
  captureGPUInfo: function() {
    if (this.gpuInfo) {
      return this.gpuInfo;
    }
    var gl = this.gl, gpuInfo = { renderer: '', vendor: '' };
    if (!gl) {
      return gpuInfo;
    }
    var ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      var renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      var vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
      if (renderer) {
        gpuInfo.renderer = renderer.toLowerCase();
      }
      if (vendor) {
        gpuInfo.vendor = vendor.toLowerCase();
      }
    }
    this.gpuInfo = gpuInfo;
    return gpuInfo;
  },
};

function resizeCanvasIfNeeded(pipelineState) {
  var targetCanvas = pipelineState.targetCanvas,
      width = targetCanvas.width, height = targetCanvas.height,
      dWidth = pipelineState.destinationWidth,
      dHeight = pipelineState.destinationHeight;

  if (width !== dWidth || height !== dHeight) {
    targetCanvas.width = dWidth;
    targetCanvas.height = dHeight;
  }
}

/**
 * Copy an input WebGL canvas on to an output 2D canvas.
 *
 * The WebGL canvas is assumed to be upside down, with the top-left pixel of the
 * desired output image appearing in the bottom-left corner of the WebGL canvas.
 *
 * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
 * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
 * @param {Object} pipelineState The 2D target canvas to copy on to.
 */
function copyGLTo2DDrawImage(gl, pipelineState) {
  var glCanvas = gl.canvas, targetCanvas = pipelineState.targetCanvas,
      ctx = targetCanvas.getContext('2d');
  ctx.translate(0, targetCanvas.height); // move it down again
  ctx.scale(1, -1); // vertical flip
  // where is my image on the big glcanvas?
  var sourceY = glCanvas.height - targetCanvas.height;
  ctx.drawImage(glCanvas, 0, sourceY, targetCanvas.width, targetCanvas.height, 0, 0,
    targetCanvas.width, targetCanvas.height);
}

/**
 * Copy an input WebGL canvas on to an output 2D canvas using 2d canvas' putImageData
 * API. Measurably faster than using ctx.drawImage in Firefox (version 54 on OSX Sierra).
 *
 * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
 * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
 * @param {Object} pipelineState The 2D target canvas to copy on to.
 */
function copyGLTo2DPutImageData(gl, pipelineState) {
  var targetCanvas = pipelineState.targetCanvas, ctx = targetCanvas.getContext('2d'),
      dWidth = pipelineState.destinationWidth,
      dHeight = pipelineState.destinationHeight,
      numBytes = dWidth * dHeight * 4;

  // eslint-disable-next-line no-undef
  var u8 = new Uint8Array(this.imageBuffer, 0, numBytes);
  // eslint-disable-next-line no-undef
  var u8Clamped = new Uint8ClampedArray(this.imageBuffer, 0, numBytes);

  gl.readPixels(0, 0, dWidth, dHeight, gl.RGBA, gl.UNSIGNED_BYTE, u8);
  var imgData = new ImageData(u8Clamped, dWidth, dHeight);
  ctx.putImageData(imgData, 0, 0);
}
//-------------move webgl_backend.class.js to here ↑------------------


import { util } from "../util/index.js";
import { fabricObject } from "../shapes/object.class.js";
import { StaticCanvas } from "../static_canvas.class.js";

util.object.extend(fabricObject.prototype, /** @lends fabricObject.prototype */ {

  /**
   * @private
   * @return {Number} angle value
   */
  _getAngleValueForStraighten: function() {
    var angle = this.angle % 360;
    if (angle > 0) {
      return Math.round((angle - 1) / 90) * 90;
    }
    return Math.round(angle / 90) * 90;
  },

  /**
   * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
   * @return {fabricObject} thisArg
   * @chainable
   */
  straighten: function() {
    return this.rotate(this._getAngleValueForStraighten());
  },

  /**
   * Same as {@link fabricObject.prototype.straighten} but with animation
   * @param {Object} callbacks Object with callback functions
   * @param {Function} [callbacks.onComplete] Invoked on completion
   * @param {Function} [callbacks.onChange] Invoked on every step of animation
   * @return {fabricObject} thisArg
   */
  fxStraighten: function(callbacks) {
    callbacks = callbacks || { };

    var empty = function() { },
        onComplete = callbacks.onComplete || empty,
        onChange = callbacks.onChange || empty,
        _this = this;

    return util.animate({
      target: this,
      startValue: this.get('angle'),
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: function(value) {
        _this.rotate(value);
        onChange();
      },
      onComplete: function() {
        _this.setCoords();
        onComplete();
      },
    });
  }
});

util.object.extend(StaticCanvas.prototype, /** @lends StaticCanvas.prototype */ {

  /**
   * Straightens object, then rerenders canvas
   * @param {fabricObject} object Object to straighten
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  straightenObject: function (object) {
    object.straighten();
    this.requestRenderAll();
    return this;
  },

  /**
   * Same as {@link fabric.Canvas.prototype.straightenObject}, but animated
   * @param {fabricObject} object Object to straighten
   * @return {fabric.Canvas} thisArg
   */
  fxStraightenObject: function (object) {
    return object.fxStraighten({
      onChange: this.requestRenderAllBound
    });
  }
});

import { util } from '../util/index.js';
import { BaseBrush } from './base_brush.class.js';
import { Shadow } from '../shadow.class.js';
import { Point } from '../point.class.js';
import { Color } from '../color.class.js';
import { Circle } from '../shapes/circle.class.js';
import { Group } from '../shapes/group.class.js';

/**
 * CircleBrush class
 * @class fabric.CircleBrush
 */
export const CircleBrush = util.createClass(BaseBrush, /** @lends fabric.CircleBrush.prototype */ {

  /**
   * Width of a brush
   * @type Number
   * @default
   */
  width: 10,

  /**
   * Constructor
   * @param {fabric.Canvas} canvas
   * @return {fabric.CircleBrush} Instance of a circle brush
   */
  initialize: function(canvas) {
    this.canvas = canvas;
    this.points = [];
  },

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Object} pointer
   */
  drawDot: function(pointer) {
    var point = this.addPoint(pointer),
        ctx = this.canvas.contextTop;
    this._saveAndTransform(ctx);
    this.dot(ctx, point);
    ctx.restore();
  },

  dot: function(ctx, point) {
    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  /**
   * Invoked on mouse down
   */
  onMouseDown: function(pointer) {
    this.points.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(pointer);
  },

  /**
   * Render the full state of the brush
   * @private
   */
  _render: function() {
    var ctx  = this.canvas.contextTop, i, len,
        points = this.points;
    this._saveAndTransform(ctx);
    for (i = 0, len = points.length; i < len; i++) {
      this.dot(ctx, points[i]);
    }
    ctx.restore();
  },

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove: function(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    if (this.needsFullRender()) {
      this.canvas.clearContext(this.canvas.contextTop);
      this.addPoint(pointer);
      this._render();
    }
    else {
      this.drawDot(pointer);
    }
  },

  /**
   * Invoked on mouse up
   */
  onMouseUp: function() {
    var originalRenderOnAddRemove = this.canvas.renderOnAddRemove, i, len;
    this.canvas.renderOnAddRemove = false;

    var circles = [];

    for (i = 0, len = this.points.length; i < len; i++) {
      var point = this.points[i],
          circle = new Circle({
            radius: point.radius,
            left: point.x,
            top: point.y,
            originX: 'center',
            originY: 'center',
            fill: point.fill
          });

      this.shadow && (circle.shadow = new Shadow(this.shadow));

      circles.push(circle);
    }
    var group = new Group(circles);
    group.canvas = this.canvas;

    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  },

  /**
   * @param {Object} pointer
   * @return {Point} Just added pointer point
   */
  addPoint: function(pointer) {
    var pointerPoint = new Point(pointer.x, pointer.y),

        circleRadius = util.getRandomInt(
          Math.max(0, this.width - 20), this.width + 20) / 2,

        circleColor = new Color(this.color)
          .setAlpha(util.getRandomInt(0, 100) / 100)
          .toRgba();

    pointerPoint.radius = circleRadius;
    pointerPoint.fill = circleColor;

    this.points.push(pointerPoint);

    return pointerPoint;
  }
});

import { util } from '../util/index.js';
import { fabricObject } from "./object.class.js";
import { Polyline } from "./polyline.class.js";
import { SHARED_ATTRIBUTES } from "../header.js";

var projectStrokeOnPoints = util.projectStrokeOnPoints;

/**
 * Polygon class
 * @class Polygon
 * @extends Polyline
 * @see {@link Polygon#initialize} for constructor definition
 */
const Polygon = util.createClass(Polyline, /** @lends Polygon.prototype */ {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type: 'polygon',

  /**
   * @private
   */
  _projectStrokeOnPoints: function () {
    return projectStrokeOnPoints(this.points, this);
  },

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render: function(ctx) {
    if (!this.commonRender(ctx)) {
      return;
    }
    ctx.closePath();
    this._renderPaintInOrder(ctx);
  },

});

/* _FROM_SVG_START_ */
/**
 * List of attribute names to account for when parsing SVG element (used by `Polygon.fromElement`)
 * @static
 * @memberOf Polygon
 * @see: http://www.w3.org/TR/SVG/shapes.html#PolygonElement
 */
Polygon.ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat();

/**
 * Returns {@link Polygon} instance from an SVG element
 * @static
 * @memberOf Polygon
 * @param {SVGElement} element Element to parse
 * @param {Function} callback callback function invoked after parsing
 * @param {Object} [options] Options object
 */
Polygon.fromElement = Polyline.fromElementGenerator('Polygon');
/* _FROM_SVG_END_ */

/**
 * Returns Polygon instance from an object representation
 * @static
 * @memberOf Polygon
 * @param {Object} object Object to create an instance from
 * @returns {Promise<Polygon>}
 */
Polygon.fromObject = function(object) {
  return fabricObject._fromObject(Polygon, object, 'points');
};

export {
  Polygon
};
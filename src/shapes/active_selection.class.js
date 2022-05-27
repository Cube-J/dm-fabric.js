import { util } from "../util/index.js";
import { Group } from "./group.class.js";

/**
 * Group class
 * @class ActiveSelection
 * @extends Group
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#groups}
 * @see {@link ActiveSelection#initialize} for constructor definition
 */
const ActiveSelection = util.createClass(Group, /** @lends ActiveSelection.prototype */ {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type: 'activeSelection',

  /**
   * @override
   */
  layout: 'fit-content',

  /**
   * @override
   */
  subTargetCheck: false,

  /**
   * @override
   */
  interactive: false,

  /**
   * Constructor
   *
   * @param {fabric.Object[]} [objects] instance objects
   * @param {Object} [options] Options object
   * @param {boolean} [objectsRelativeToGroup] true if objects exist in group coordinate plane
   * @return {ActiveSelection} thisArg
   */
  initialize: function (objects, options, objectsRelativeToGroup) {
    this.callSuper('initialize', objects, options, objectsRelativeToGroup);
    this.setCoords();
  },

  /**
   * @private
   */
  _shouldSetNestedCoords: function () {
    return true;
  },

  /**
   * @private
   * @param {fabric.Object} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   * @returns {boolean} true if object entered group
   */
  enterGroup: function (object, removeParentTransform) {
    if (!this.canEnter(object)) {
      return false;
    }
    if (object.group) {
      //  save ref to group for later in order to return to it
      var parent = object.group;
      parent._exitGroup(object);
      object.__owningGroup = parent;
    }
    this._enterGroup(object, removeParentTransform);
    return true;
  },

  /**
   * we want objects to retain their canvas ref when exiting instance
   * @private
   * @param {fabric.Object} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup: function (object, removeParentTransform) {
    this._exitGroup(object, removeParentTransform);
    var parent = object.__owningGroup;
    if (parent) {
      //  return to owning group
      parent.enterGroup(object);
      delete object.__owningGroup;
    }
  },

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {fabric.Object[]} targets
   */
  _onAfterObjectsChange: function (type, targets) {
    var groups = [];
    targets.forEach(function (object) {
      object.group && !groups.includes(object.group) && groups.push(object.group);
    });
    if (type === 'removed') {
      //  invalidate groups' layout and mark as dirty
      groups.forEach(function (group) {
        group._onAfterObjectsChange('added', targets);
      });
    }
    else {
      //  mark groups as dirty
      groups.forEach(function (group) {
        group._set('dirty', true);
      });
    }
  },

  /**
   * If returns true, deselection is cancelled.
   * @since 2.0.0
   * @return {Boolean} [cancel]
   */
  onDeselect: function() {
    this.removeAll();
    return false;
  },

  /**
   * Returns string representation of a group
   * @return {String}
   */
  toString: function() {
    return '#<ActiveSelection: (' + this.complexity() + ')>';
  },

  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * @return {Boolean}
   */
  shouldCache: function() {
    return false;
  },

  /**
   * Check if this group or its parent group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache: function() {
    return false;
  },

  /**
   * Renders controls and borders for the object
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [styleOverride] properties to override the object style
   * @param {Object} [childrenOverride] properties to override the children overrides
   */
  _renderControls: function(ctx, styleOverride, childrenOverride) {
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    this.callSuper('_renderControls', ctx, styleOverride);
    var options = Object.assign(
      { hasControls: false },
      childrenOverride,
      { forActiveSelection: true }
    );
    for (var i = 0; i < this._objects.length; i++) {
      this._objects[i]._renderControls(ctx, options);
    }
    ctx.restore();
  },
});

/**
 * Returns {@link ActiveSelection} instance from an object representation
 * @static
 * @memberOf ActiveSelection
 * @param {Object} object Object to create a group from
 * @returns {Promise<ActiveSelection>}
 */
ActiveSelection.fromObject = function(object) {
  var objects = object.objects,
      options = util.object.clone(object, true);
  delete options.objects;
  return util.enlivenObjects(objects).then(function(enlivenedObjects) {
    return new ActiveSelection(enlivenedObjects, options, true);
  });
};  

export { ActiveSelection };
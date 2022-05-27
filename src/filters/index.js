import { util } from '../util/index.js';
import { BaseFilter } from "./base_filter.class.js";
import { BlendColor } from "./blendcolor_filter.class.js";
import { BlendImage } from "./blendimage_filter.class.js";
import { Blur } from "./blur_filter.class.js";
import { Brightness } from "./brightness_filter.class.js";
import { ColorMatrix } from "./colormatrix_filter.class.js";
import { Composed } from "./composed_filter.class.js";
import { Contrast } from "./contrast_filter.class.js";
import { Convolute } from "./convolute_filter.class.js";
import { MyFilter } from "./filter_boilerplate.js";
import { Gamma } from "./gamma_filter.class.js";
import { Grayscale } from "./grayscale_filter.class.js";
import { HueRotation } from "./hue_rotation.class.js";
import { Invert } from "./invert_filter.class.js";
import { Noise } from "./noise_filter.class.js";
import { Pixelate } from "./pixelate_filter.class.js";
import { RemoveColor } from "./removecolor_filter.class.js";
import { Resize } from "./resize_filter.class.js";
import { Saturation } from "./saturate_filter.class.js";
import { Vibrance } from "./vibrance_filter.class.js";

const filters = {
  BaseFilter,
  BlendColor,
  BlendImage,
  Blur,
  Brightness,
  ColorMatrix,
  Composed,
  Contrast,
  Convolute,
  MyFilter,
  Gamma,
  Grayscale,
  HueRotation,
  Invert,
  Noise,
  Pixelate,
  RemoveColor,
  Resize,
  Saturation,
  Vibrance
};

var createClass = util.createClass;

var matrices = {
  Brownie: [
    0.59970,0.34553,-0.27082,0,0.186,
    -0.03770,0.86095,0.15059,0,-0.1449,
    0.24113,-0.07441,0.44972,0,-0.02965,
    0,0,0,1,0
  ],
  Vintage: [
    0.62793,0.32021,-0.03965,0,0.03784,
    0.02578,0.64411,0.03259,0,0.02926,
    0.04660,-0.08512,0.52416,0,0.02023,
    0,0,0,1,0
  ],
  Kodachrome: [
    1.12855,-0.39673,-0.03992,0,0.24991,
    -0.16404,1.08352,-0.05498,0,0.09698,
    -0.16786,-0.56034,1.60148,0,0.13972,
    0,0,0,1,0
  ],
  Technicolor: [
    1.91252,-0.85453,-0.09155,0,0.04624,
    -0.30878,1.76589,-0.10601,0,-0.27589,
    -0.23110,-0.75018,1.84759,0,0.12137,
    0,0,0,1,0
  ],
  Polaroid: [
    1.438,-0.062,-0.062,0,0,
    -0.122,1.378,-0.122,0,0,
    -0.016,-0.016,1.483,0,0,
    0,0,0,1,0
  ],
  Sepia: [
    0.393, 0.769, 0.189, 0, 0,
    0.349, 0.686, 0.168, 0, 0,
    0.272, 0.534, 0.131, 0, 0,
    0, 0, 0, 1, 0
  ],
  BlackWhite: [
    1.5, 1.5, 1.5, 0, -1,
    1.5, 1.5, 1.5, 0, -1,
    1.5, 1.5, 1.5, 0, -1,
    0, 0, 0, 1, 0,
  ]
};


for (var key in matrices) {
  filters[key] = createClass(ColorMatrix, /** @lends fabric.Image.filters.Sepia.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: key,

    /**
     * Colormatrix for the effect
     * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
     * outside the -1, 1 range.
     * @param {Array} matrix array of 20 numbers.
     * @default
     */
    matrix: matrices[key],

    /**
     * Lock the matrix export for this kind of static, parameter less filters.
     */
    mainParameter: false,
    /**
     * Lock the colormatrix on the color part, skipping alpha
     */
    colorsOnly: true,

  });
  filters[key].fromObject = filters.BaseFilter.fromObject;
}


export { 
  filters
};
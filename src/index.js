// const fabric = require('fabric').fabric;
let fabric;
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  fabric = require('./fabric.js').fabric;
} else {
  fabric = { version: '5.2.1' };
}
export { fabric };
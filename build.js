var browserify = require('browserify');
var b = browserify();
b.add('./dist/fabric.min.js');
b.bundle().pipe(process.stdout);
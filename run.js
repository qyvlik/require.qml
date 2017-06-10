Qt.include("qt-require.js");

var pako = require('./node_modules/pako/index.js');

var test = { my: 'super', puper: [456, 567], awesome: 'pako' };

var binaryString = pako.deflate(JSON.stringify(test), { to: 'string' });

// TODO <Unknown File>:385: unknown compression method
// maybe: https://github.com/nodeca/pako/pull/49
var restored = JSON.parse(pako.inflate(binaryString, { to: 'string' }));


Qt.include("qt-require.js");

//debugEnable = true;

var require = requireBuilder(requireDefaultContext('./node_modules'));

function tryPako() {
    try {
        var pako = require('pako');

        var test = { my: 'super', puper: [456, 567], awesome: 'pako' };

        var binaryString = pako.deflate(JSON.stringify(test), { to: 'string' });

        // TODO <Unknown File>:385: unknown compression method
        // maybe: https://github.com/nodeca/pako/pull/49
        var restored = JSON.parse(pako.inflate(binaryString, { to: 'string' }));
    } catch(e) {
        if (typeof e.message !== 'undefined') {
            console.error(e.message);
            console.error(e.name, e.fileName , e.lineNumber);
            console.error(e.stack);
        } else {
            console.error(e);
            console.trace();
        }
    }
}

function tryCryptoJS() {
    try {
        var CryptoJS = require("crypto-js");
        console.log(CryptoJS.HmacSHA1("Message", "Key"));
        var SHA256 = require("crypto-js/sha256");
        console.log(SHA256("Message"));
    } catch(e) {
        console.error(e);
        console.trace();
    }
}


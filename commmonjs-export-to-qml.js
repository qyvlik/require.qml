Qt.include("qt-require.js");

//debugEnable = true;

var require = requireBuilder(requireDefaultContext('./node_modules'));

function __try(callback, error) {
    error = error || function(e) {
        if (typeof e.message !== 'undefined') {
            console.error(e.message);
            console.error(e.name, e.fileName , e.lineNumber);
            console.error(e.stack);
        } else {
            console.error(e);
            console.trace();
        }
    }
    try {
        callback();
    }  catch(e) {
        error(e);
    }
}

function tryPako() {
    __try(function(){
        var pako = require('pako');

        var test = { my: 'super', puper: [456, 567], awesome: 'pako' };

        var binaryString = pako.deflate(JSON.stringify(test), { to: 'string' });

        // TODO <Unknown File>:385: unknown compression method
        // maybe: https://github.com/nodeca/pako/pull/49
        var restored = JSON.parse(pako.inflate(binaryString, { to: 'string' }));
    });
}

function tryCryptoJS() {    
    __try(function(){
        var CryptoJS = require("crypto-js");
        console.log(CryptoJS.HmacSHA1("Message", "Key"));
        var SHA256 = require("crypto-js/sha256");
        console.log(SHA256("Message"));
    });
}


function tryShowdown() {
    __try(function(){
        var showdown = require("showdown/dist/showdown.js");
        var converter = new showdown.Converter({'tables': true})
        var text      = '#hello, markdown!\n'
                +'| h1    |    h2   |      h3 |\n'
                +'|:------|:-------:|--------:|\n'
                +'| 100   | [a][1]  | ![b][2] |\n'
                +'| *foo* | **bar** | ~~baz~~ |\n'

        var html      = converter.makeHtml(text);
        console.log('html:', html);
    });
}

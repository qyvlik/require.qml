var inl = require('./util-inline.js');

function func() {
    console.log('utils/util.js : func');
    console.log('inl', inl);
    inl.utilInline();
}

exports.func = func;

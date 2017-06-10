.pragma library

String.prototype.startWith = function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
}

String.prototype.endWith = function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
}

function readFileSync(file, callable, error) {
//    debug('readFileSync start: file:', file);
    function setHeader(xhr, headers) {
        //"Content-Type":"application/x-www-form-urlencoded"
        for(var iter in headers) {
            xhr.setRequestHeader(iter, headers[iter]);
        }
    }

    function ajax(method, url, headers, data, callable) {
        headers = headers || {};
        callable = callable || function(xhr) {
            console.log(xhr.responseText);
        }

        var xhr = new XMLHttpRequest;
        setHeader(xhr, headers);
        xhr.open(method, url, false);
        xhr.onreadystatechange = function() {
            callable(xhr);
        };
        if("GET" === method) {
            xhr.send();
        } else {
            xhr.send(data);
        }
    }

    callable = callable || function(fileContent) {
        console.info("fileContent size: ", fileContent.length);
    }

    error = error || function(e) {
        console.error("readFileAsync error : ", e);
    }

    ajax("GET", file, {}, "", function(xhr){
        //        debug("xhr.status:", xhr.status);
        //        debug("xhr.statusText:", xhr.statusText);
        //        debug('last-modified:', xhr.getResponseHeader("last-modified"));
        //        debug('content-length:', xhr.getResponseHeader("content-length"));
        //        debug("xhr.readyState:", xhr.readyState)
        //        debug("xhr.getAllResponseHeaders():", xhr.getAllResponseHeaders());
        //        debug("-----------------");

        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                callable(xhr.responseText);
            } else {
                var lastModified = xhr.getResponseHeader("last-modified");
                var contentLenght = xhr.getResponseHeader("content-length");
                if (lastModified === '' || contentLenght === '') {
                    error(file +", is not exist!");
                }
            }
        }
    });
}

function getPathFromFileName(fileName) {
    var list = fileName.split("/");
    list.pop();
    return list.join("/");
}

function getThisPath() {
    var file = Qt.resolvedUrl("###").replace("###", "");
    return getPathFromFileName(file);
}

var modulesCache = {};

var debugEnable = false

var debug = function() {
    if (debugEnable) {
        var depth = new String(' ', recursionDepth);
        var argsLenght = arguments.length;
        arguments.length += 1;
        while(argsLenght != 0) {
            arguments[argsLenght] = arguments[argsLenght-1];
            argsLenght -= 1;
        }
        arguments[0] = depth;
        console.debug.apply(console, arguments);
    }
}


function requireDefaultContext(dirname) {
    var module = {};
    var exports = {};
    module.exports = exports;
    module.loaded = false;
    module.parent = null;
    module.filename = null;
    module.id = null;
    var ctx = {
        'module': module,
        'exports': exports,
        'dirname': dirname,
        'filename': ""
    };

    debug("requireDefaultContext ctx:", JSON.stringify(ctx));

    return ctx;
}

function getFileWithSuffix(dirname, fileName, suffix) {
    dirname = dirname || "";
    fileName = fileName || "";
    suffix = suffix || "";
    if (dirname.endWith("/")) {
        dirname = dirname.substr(0, dirname.lenght-1);
    }
    var dirnameList = dirname.split("/");

    while(fileName.startWith("./") || fileName.startWith("../")) {
        if (fileName.startWith("./")) {
            fileName = fileName.substr(2, fileName.length);
        }
        if (fileName.startWith("../")) {
            fileName = fileName.substr(3, fileName.length);
            dirnameList.pop();
        }
    }

    if (fileName.endWith("/")) {
        fileName = fileName.substr(0, fileName.lenght-1);
    }

    var fullFileName = dirnameList.join("/") + "/" + fileName + suffix;
    dirnameList = fullFileName.split("/");
    dirnameList.pop();
    return [dirnameList.join("/"), fullFileName];
}

function requireBuilder(ctx) {

    ctx = ctx || requireDefaultContext('');

    var dirname = ctx.dirname;
    var module = ctx.module;
    var exports = ctx.exports;

    function requireFun(moduleName) {
        var suffixList = ['', '.js', '.json', '.node',
                          '/package.json', '/index.js', '/index.json', '/index.node'];

        function compileSync(jsText) {
            var fun = new Function("require", "module", "exports", jsText);
            try {
                fun(requireBuilder(requireDefaultContext(nextModuleDirName)),
                    module, exports);
            } catch(e) {
                console.trace();
                throw new Error('requireFun: ' + moduleFullFileNamePath + ' fail e:' + e);
            }
        }

        var jsFileTextContent = '';
        var moduleFullFileNamePath = '';
        var nextModuleDirName = '';
        var readFile = false;

        while (!readFile) {

            var suffix = suffixList.shift();
            if (typeof suffix === 'undefined') {
                throw new Error("not found: " + moduleFullFileNamePath);
            }

            var pathInfo = getFileWithSuffix(dirname, moduleName, suffix);

            nextModuleDirName = pathInfo[0];
            moduleFullFileNamePath = pathInfo[1];

            jsFileTextContent = modulesCache[moduleFullFileNamePath];

            if (typeof jsFileTextContent != 'undefined' && jsFileTextContent !== '') {
                debug('modulesCache[', moduleFullFileNamePath, "]: not emtpy");
                compileSync(jsFileTextContent);
                readFile = true;
                break;
            }

            readFileSync(moduleFullFileNamePath, function(jsText){
                debug('compileSync start:', moduleFullFileNamePath);
                compileSync(jsText);
                debug('compileSync success:', moduleFullFileNamePath);

                modulesCache[moduleFullFileNamePath] = jsText;
                readFile = true;

                module.id = moduleFullFileNamePath;
                module.filename = moduleFullFileNamePath;
                module.loaded = true;

            }, function(e){
                // debug('requireFun readFileSync fail e:' + e);
            });
        }

        return module.exports;
    }

    return requireFun;
}


var require = requireBuilder(requireDefaultContext(getThisPath()));

//! [require() 源码解读](http://www.ruanyifeng.com/blog/2015/05/require.html)
//! [](https://github.com/grassator/qml-commonjs?files=1)
//! [quickly/quickly](https://github.com/quickly/quickly)
// setTimeout / clearTimeout / setInterval / clearInterval

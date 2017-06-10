.pragma library

String.prototype.startWith = function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}

String.prototype.endWith = function(str){
  var reg=new RegExp(str+"$");
  return reg.test(this);
}

var modulesCache = {};

function readFileSync(file, callable, error) {

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
        if (xhr.status === 200) {
            callable(xhr.responseText);
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

function requireDefaultContext(dirname) {
    var module = {};
    var exports = {};
    module.exports = exports;

    var ctx = {
        'module': module,
        'exports': exports,
        'dirname': dirname,
    };

//    console.debug("ctx:", JSON.stringify(ctx));

    return ctx;
}

function requireBuilder(ctx) {
    ctx = ctx || requireDefaultContext('');

    function requireUrl2FileName(dirname, url) {
        if (url in ['http']) {
            throw new Error('require url: ' + url + " fail, not support build in module");
        }
        if (dirname === '') {
            return url;
        }
        if (!dirname.endWith("/")) {
            dirname += "/"
        }
        if (url.startWith("./")) {
            url = url.substr(2, url.length);
        }

        return dirname + url;
    }

    function requireUrl2DirName(dirname, url) {
        return getPathFromFileName(requireUrl2FileName(dirname, url));
    }

    function requireFun(url) {
        var module = ctx.module;
        var exports =  ctx.exports;
        var dirname = ctx.dirname;
        var filename = requireUrl2FileName(ctx.dirname, url);

        function compileSync(jsText) {
            var fun = new Function("module", "exports", "require", jsText);
            try {
                // module compile
                fun(module, exports, requireBuilder(requireDefaultContext(requireUrl2DirName(ctx.dirname, url))));
            } catch(e) {
                console.trace();
                console.error(e);
                throw new Error('requireFun fail e:' + e);
            }
        }

        var jsFileContent = modulesCache[filename];

        if (typeof jsFileContent !== 'undefined' && jsFileContent !== '') {
            compileSync(jsFileContent);
        } else {
            readFileSync(filename, function(jsText){
                // console.debug('require url:', filename);
                // console.debug('require jsText:\n', jsText)
                compileSync(jsText);
                modulesCache[filename] = jsText;
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

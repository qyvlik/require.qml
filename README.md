# require.qml

> set env `QML_DISABLE_DISK_CACHE` to `true`

Try to implement commonjs by pure qml

## Note

When you use `npm` to install some `node module`, please **close QtCreator**! Because QtCreator will appropriate the directory.

AND THE JS FUNCTION WHITCH USE THE `require` LOAD CAN'T **DEBUG**!

---

> 设置环境变量 `QML_DISABLE_DISK_CACHE` 为 `true`，禁用 `qmlc` 功能，防止生成 `qmlc` 和 `jsc` 文件。

## 注意

当你使用 `npm` 安装依赖时，请关闭 `QtCreator`！因为 `QtCreator` 会占用文件，导致 `npm` 修改文件夹名称失败。

并且使用 `require` 加载的 JS 函数**无法调试**！

---

[grassator/qml-commonjs](https://github.com/grassator/qml-commonjs)

[quickly/quickly](https://github.com/quickly/quickly)

> S6 and Node.js-like environment for QML

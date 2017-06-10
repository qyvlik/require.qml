import QtQuick 2.6

import "./run.js" as R
//import QmlProject 1.1

Item {
    visible: true
    width: 240
    height: 320
    focus: true
    Keys.onEscapePressed: {
        Qt.quit();
//        f.files
    }
//    JavaScriptFiles {
//        id: f
//        directory: "."

//    }
}



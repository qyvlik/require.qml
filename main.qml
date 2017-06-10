import QtQuick 2.6

import "commmonjs-export-to-qml.js" as R

Item {
    visible: true
    width: 240
    height: 320
    focus: true
    Keys.onEscapePressed: {
        Qt.quit();
    }
}



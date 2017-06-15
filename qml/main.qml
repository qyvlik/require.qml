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

    Text {
        anchors.centerIn: parent
        text: "runAllTry"
    }

    MouseArea {
        anchors.fill: parent
        onClicked: runAllTry();
    }

    function runAllTry() {
        for(var iter in R) {
            if (iter.startWith("try")) {
                R[iter]();
            }
        }
    }
}



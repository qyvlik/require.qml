import QtQuick 2.6

import "./run.js" as R;

Item {
    visible: true
    width: 240
    height: 320
    focus: true
    Keys.onEscapePressed: {
        Qt.quit()
    }

    Component.onCompleted: {
        R.util.func();
    }
}

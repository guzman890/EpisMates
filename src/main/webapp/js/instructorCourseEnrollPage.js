'use strict';

/* global BootboxWrapper:false StatusType:false prepareInstructorPages:false */

var loadUpFunction = function loadUpFunction() {
    var typingErrMsg = 'Please use | character ( shift+\\ ) to seperate fields, or copy from your existing spreadsheet.';
    var notified = false;

    function isUserTyping(str) {
        return str.indexOf('\t') === -1 && str.indexOf('|') === -1;
    }
    window.isUserTyping = isUserTyping;

    var ENTER_KEYCODE = 13;
    var enrolTextbox = $('#enrollstudents');
    if (enrolTextbox.length) {
        enrolTextbox = enrolTextbox[0];
        $(enrolTextbox).keydown(function (e) {
            var keycode = e.which || e.keyCode;
            if (keycode === ENTER_KEYCODE) {
                if (isUserTyping(e.target.value) && !notified) {
                    notified = true;
                    BootboxWrapper.showModalAlert('Invalid separator', typingErrMsg, BootboxWrapper.DEFAULT_OK_TEXT, StatusType.WARNING);
                }
            }
        });
    }
};

if (window.addEventListener) {
    window.addEventListener('load', loadUpFunction);
} else {
    window.attachEvent('load', loadUpFunction);
}

$(document).ready(function () {
    prepareInstructorPages();
});
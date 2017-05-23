'use strict';

/**
 * Contains functions related to student MOTD.
 */
function fetchMotd(motdUrl, motdContentSelector, motdContainerSelector) {
    $.ajax({
        type: 'GET',
        url: window.location.origin + '/' + motdUrl,
        success: function success(data) {
            $(motdContentSelector).html(data);
        },
        error: function error() {
            $(motdContainerSelector).html('');
        }
    });
}

function bindCloseMotdButton(btnSelector, motdContainerSelector) {
    $(document).on('click', btnSelector, function () {
        $(motdContainerSelector).hide();
    });
}

$(document).ready(function () {
    var motdUrl = $('#motd-url').val();
    fetchMotd(motdUrl, '#student-motd', '#student-motd-container');
    bindCloseMotdButton('#btn-close-motd', '#student-motd-container');
});

/*
export default {
    fetchMotd,
    bindCloseMotdButton,
};
*/
/* exported fetchMotd, bindCloseMotdButton */
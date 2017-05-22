'use strict';

/* global StatusType:false setStatusMessage:false addLoadingIndicator:false removeLoadingIndicator:false */
/**
 * Contains functions to be used to display email logs in `/adminEmailLog`
 */

var numOfEntriesPerPage = 50;

function toggleReference() {
    $('#filterReference').toggle('slow');

    var button = $('#detailButton').attr('class');

    if (button === 'glyphicon glyphicon-chevron-down') {
        $('#detailButton').attr('class', 'glyphicon glyphicon-chevron-up');
        $('#referenceText').text('Hide Reference');
    } else {
        $('#detailButton').attr('class', 'glyphicon glyphicon-chevron-down');
        $('#referenceText').text('Show Reference');
    }
}

function handler() {
    $(this).nextAll('.email-log-content-sanitized').first().toggle();
    $(this).nextAll('.email-log-content-unsanitized').first().toggle();
}

function bindClickAction() {
    $('body').unbind('click', handler).on('click', '.email-log-header', handler);
}

function setFormErrorMessage(button, msg) {
    button.after('&nbsp;&nbsp;&nbsp;' + msg);
}

/**
 * Highlights search keywords for different fields in email log messages.
 */
function highlightKeywordsInEmailLogMessages() {
    $('.email-receiver').highlight($('#query-keywords-for-receiver').val().split(','));
    $('.email-subject').highlight($('#query-keywords-for-subject').val().split(','));
    $('.email-content').highlight($('#query-keywords-for-content').val().split(','));
}

$(document).ready(function () {
    bindClickAction();
    highlightKeywordsInEmailLogMessages();
    $('#filterReference').toggle();
});

function submitFormAjax(offset) {
    $('input[name=offset]').val(offset);
    var formObject = $('#ajaxLoaderDataForm');
    var formData = formObject.serialize();
    var $button = $('#button_older');
    var $logsTable = $('#email-logs-table > tbody');

    $.ajax({
        type: 'POST',
        url: '/admin/adminEmailLogPage?' + formData,
        beforeSend: function beforeSend() {
            addLoadingIndicator($button, '');
        },
        error: function error() {
            setFormErrorMessage($button, 'Failed to load older logs. Please try again.');
            removeLoadingIndicator($button, 'Retry');
        },
        success: function success(data) {
            var $data = $(data);
            $logsTable.append($data.find('#email-logs-table > tbody').html());
            bindClickAction();
            highlightKeywordsInEmailLogMessages();
            setStatusMessage($data.find('#status-message').html(), StatusType.INFO);
        }
    });
}

/*
export default {
    toggleReference,
    submitFormAjax,
};
*/
/* exported toggleReference, submitFormAjax */
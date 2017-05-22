'use strict';

/* global prepareDatepickers:false linkAjaxForResponseRate:false readyFeedbackPage:false richTextEditorBuilder:false
setStatusMessage:false, appendStatusMessage:false, clearStatusMessages:false, bindEventsAfterAjax:false, StatusType:false
loadSessionsByAjax:false prepareRemindModal:false prepareInstructorPages:false
*/

var isSessionsAjaxSending = false;
var oldStatus = null;

var ajaxRequest = function ajaxRequest(e) {
    e.preventDefault();

    if (isSessionsAjaxSending) {
        return;
    }

    var formData = $(this).serialize();
    $.ajax({
        type: 'POST',
        cache: false,
        url: $(this).attr('action') + '?' + formData,
        beforeSend: function beforeSend() {
            isSessionsAjaxSending = true;
            $('#sessionList').html('<img height="75" width="75" class="margin-center-horizontal" ' + 'src="/images/ajax-preload.gif"/>');
        },
        error: function error() {
            isSessionsAjaxSending = false;
            $('#sessionList').html('');
            $('#loadSessionsFailErrorMsg').on('click', loadSessionsByAjax);
            var msg = 'Failed to load sessions. ' + 'Please <a href="#" id="loadSessionsFailErrorMsg">click here</a> to retry.';
            setStatusMessage(msg, StatusType.DANGER);

            if (oldStatus !== null && oldStatus !== undefined && oldStatus !== '') {
                appendStatusMessage(oldStatus);
            }
        },
        success: function success(data) {
            clearStatusMessages();
            appendStatusMessage(oldStatus);

            var appendedModalBody = $(data).find('#copySessionsBody').html();
            var appendedSessionTable = $(data).find('#sessionList').html();

            $('#button_copy').text('Copiar preguntas de sesiones anteriores');
            $('#copySessionsBody').html(appendedModalBody);
            $('#sessionList').removeClass('align-center').html(appendedSessionTable);
            bindEventsAfterAjax();
        }
    });
};

$(document).ready(function () {
    prepareInstructorPages();

    oldStatus = $('.statusMessage').clone();
    $('#ajaxForSessions').submit(ajaxRequest);

    prepareDatepickers();
    linkAjaxForResponseRate();

    prepareRemindModal();

    if (typeof richTextEditorBuilder !== 'undefined') {
        /* eslint-disable camelcase */ // The property names are determined by external library (tinymce)
        richTextEditorBuilder.initEditor('#instructions', {
            inline: true,
            readonly: false,
            fixed_toolbar_container: '#richtext-toolbar-container'
        });
        /* eslint-enable camelcase */
    }

    readyFeedbackPage();
});
'use strict';

/* global toggleSort:false selectElementContents:false attachEventToDeleteStudentLink:false setStatusMessage:false */
/* global BootboxWrapper:false StatusType:false prepareInstructorPages:false prepareComments:false */

function submitFormAjax() {
    var formObject = $('#csvToHtmlForm');
    var formData = formObject.serialize();
    var content = $('#detailsTable');
    var ajaxStatus = $('#ajaxStatus');

    var retryButtonHtml = '<button class="btn btn-info" id="instructorCourseDetailsRetryButton"> retry</button>';
    $('#instructorCourseDetailsRetryButton').on('click', submitFormAjax);

    $.ajax({
        type: 'POST',
        url: '/page/instructorCourseDetailsPage?' + formData,
        beforeSend: function beforeSend() {
            content.html("<img src='/images/ajax-loader.gif'/>");
        },
        error: function error() {
            ajaxStatus.html('Failed to load student table. Please try again.');
            content.html(retryButtonHtml);
        },
        success: function success(data) {
            setTimeout(function () {
                if (data.isError) {
                    ajaxStatus.html(data.errorMessage);
                    content.html(retryButtonHtml);
                } else {
                    var table = data.studentListHtmlTableAsString;
                    content.html('<small>' + table + '</small>');
                }

                setStatusMessage(data.statusForAjax);
            }, 500);
        }
    });
}

function attachEventToRemindStudentsButton() {
    $('#button_remind').on('click', function (event) {
        var $clickedButton = $(event.target);
        var messageText = '' + ('Usually, there is no need to use this feature because TEAMMATES sends an automatic ' + 'invite to students at the opening time of each session. Send a join request to ' + 'all yet-to-join students in ') + $clickedButton.data('courseId') + ' anyway?';
        var okCallback = function okCallback() {
            window.location = $clickedButton.attr('href');
        };

        BootboxWrapper.showModalConfirmation('Confirm sending join requests', messageText, okCallback, null, BootboxWrapper.DEFAULT_OK_TEXT, BootboxWrapper.DEFAULT_CANCEL_TEXT, StatusType.INFO);
    });
}

function attachEventToSendInviteLink() {
    $('.course-student-remind-link').on('click', function (event) {
        event.preventDefault();

        var $clickedLink = $(event.target);
        var messageText = 'Usually, there is no need to use this feature because TEAMMATES sends an automatic ' + 'invite to students at the opening time of each session. Send a join request anyway?';
        var okCallback = function okCallback() {
            $.get($clickedLink.attr('href'), function () {
                var studentEmail = $clickedLink.parent().siblings("td[id|='studentemail']").html().trim();
                var message = 'An email has been sent to ' + studentEmail;
                setStatusMessage(message, 'success');
            });
        };

        BootboxWrapper.showModalConfirmation('Confirm sending join request', messageText, okCallback, null, BootboxWrapper.DEFAULT_OK_TEXT, BootboxWrapper.DEFAULT_CANCEL_TEXT, StatusType.INFO);
    });
}

$(document).ready(function () {
    prepareInstructorPages();
    prepareComments();

    if ($('#button_sortstudentsection').length) {
        toggleSort($('#button_sortstudentsection'));
    } else {
        toggleSort($('#button_sortstudentteam'));
    }

    // auto select the html table when modal is shown
    $('#studentTableWindow').on('shown.bs.modal', function () {
        selectElementContents(document.getElementById('detailsTable'));
    });

    attachEventToRemindStudentsButton();
    attachEventToSendInviteLink();
    attachEventToDeleteStudentLink();
});

/*
export default {
    submitFormAjax,
};
*/
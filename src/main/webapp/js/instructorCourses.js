'use strict';

/* global COURSE_TIME_ZONE:false TimeZone:false */
/* global setStatusMessage:false StatusType:false clearStatusMessages:false */
/* global appendStatusMessage:false toggleSort:false prepareInstructorPages:false */

var isFetchingCourses = false;
var needsRetrying = false;

function linkAjaxForCourseStats() {
    var courseStatsClickHandler = function courseStatsClickHandler(e) {
        var row = $(this).closest('tr');
        var ajaxCols = $(row).children('td[id^="course-stats"]');
        var hyperlinkObject = $(this);

        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            beforeSend: function beforeSend() {
                ajaxCols.html('<img class="course-stats-loader" src="/images/ajax-loader.gif"/>');
            },
            error: function error() {
                $.each(ajaxCols, function (i, ajaxCol) {
                    var tryAgainLink = hyperlinkObject.clone();
                    $(ajaxCol).html('Failed. ').append(tryAgainLink);
                    tryAgainLink.attr('data-toggle', 'tooltip').attr('data-placement', 'top').prop('title', 'Error occured while trying to fetch course stats. Click to retry.').html('Try again?').click(courseStatsClickHandler);
                });
            },
            success: function success(data) {
                $(ajaxCols[0]).text(data.courseDetails.stats.sectionsTotal);
                $(ajaxCols[1]).html(data.courseDetails.stats.teamsTotal);
                $(ajaxCols[2]).html(data.courseDetails.stats.studentsTotal);
                $(ajaxCols[3]).html(data.courseDetails.stats.unregisteredTotal);
            }
        });
    };
    $('td[id^="course-stats"] > a').click(courseStatsClickHandler);
}

$(document).ready(function () {
    prepareInstructorPages();

    var ajaxRequest = function ajaxRequest(e) {
        if (isFetchingCourses) {
            return;
        }
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            cache: false,
            url: $(this).attr('action') + '?' + formData,
            beforeSend: function beforeSend() {
                $('#coursesList').html('<img height="75" width="75" class="margin-center-horizontal" src="/images/ajax-preload.gif"/>');
                isFetchingCourses = true;
            },
            error: function error() {
                isFetchingCourses = false;
                needsRetrying = true;
                $('#coursesList').html('');
                setStatusMessage('Courses could not be loaded. Click <a href="#" id="retryAjax">here</a> to retry.', StatusType.WARNING);
                $('#retryAjax').click(function (ev) {
                    ev.preventDefault();
                    $('#ajaxForCourses').trigger('submit');
                });
            },
            success: function success(data) {
                isFetchingCourses = false;
                if (needsRetrying) {
                    clearStatusMessages();
                    needsRetrying = false;
                }

                var statusMessages = $(data).find('.statusMessage');
                appendStatusMessage(statusMessages);

                var appendedCoursesTable = $(data).find('#coursesList').html();
                $('#coursesList').removeClass('align-center').html(appendedCoursesTable);
                toggleSort($('#button_sortcourseid'));
                linkAjaxForCourseStats();
            }
        });
    };
    $('#ajaxForCourses').submit(ajaxRequest);
    $('#ajaxForCourses').trigger('submit');

    if (typeof moment !== 'undefined') {
        var $selectElement = $('#' + COURSE_TIME_ZONE);
        TimeZone.prepareTimeZoneInput($selectElement);
        TimeZone.autoDetectAndUpdateTimeZone($selectElement);
    }
});
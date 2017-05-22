'use strict';

/* global encodeHtmlString:false */
/**
 * Functions defined and used in `/adminHome`
 */

/**
 * Generates HTML text for a row containing instructor's information
 * and status of the action.
 *
 * @param {String} shortName
 * @param {String} name
 * @param {String} email
 * @param {String} institution
 * @param {bool} isSuccess is a flag to show the action is successful or not.
 * The color and status of the row is affected by its value.
 * @param {String} status
 * @returns {String} a HTML row of action result table
 */
function createRowForResultTable(shortName, name, email, institution, isSuccess, status) {
    return '\n    <tr class="' + (isSuccess ? 'success' : 'danger') + '">\n        <td>' + encodeHtmlString(shortName) + '</td>\n        <td>' + encodeHtmlString(name) + '</td>\n        <td>' + encodeHtmlString(email) + '</td>\n        <td>' + encodeHtmlString(institution) + '</td>\n        <td>' + (isSuccess ? 'Success' : 'Fail') + '</td>\n        <td>' + status + '</td>\n    </tr>\n    ';
}

var paramsCounter = 0;
var paramsList = []; // list of parameter strings that will be sent via ajax
var instructorDetailsList = [];
var isInputFromFirstPanel = false;

/**
 * Disables the Add Instructor form.
 */
function disableAddInstructorForm() {
    $('.addInstructorBtn').each(function () {
        $(this).html("<img src='/images/ajax-loader.gif'/>");
    });
    $('.addInstructorFormControl').each(function () {
        $(this).prop('disabled', true);
    });
}

/**
 * Enables the Add Instructor form.
 */
function enableAddInstructorForm() {
    $('.addInstructorBtn').each(function () {
        $(this).html('Add Instructor');
    });
    $('.addInstructorFormControl').each(function () {
        $(this).prop('disabled', false);
    });
}

function addInstructorAjax(isError, data) {
    var rowText = void 0;
    if (isError) {
        rowText = createRowForResultTable('-', '-', '-', '-', false, 'Cannot send Ajax Request!');
    } else {
        rowText = createRowForResultTable(data.instructorShortName, data.instructorName, data.instructorEmail, data.instructorInstitution, data.instructorAddingResultForAjax, data.statusForAjax);
    }
    $('#addInstructorResultTable tbody').append(rowText);
    var isNotAddingResultForAjax = !(data && data.instructorAddingResultForAjax);
    if (isInputFromFirstPanel && isNotAddingResultForAjax) {
        var instructorsToBeRetried = $('#addInstructorDetailsSingleLine').val() + instructorDetailsList[paramsCounter] + '\n';
        $('#addInstructorDetailsSingleLine').val(instructorsToBeRetried);
    }
    paramsCounter += 1;
    var panelHeader = '<strong>Result (' + paramsCounter + '/' + paramsList.length + ')</strong>';
    $('#addInstructorResultPanel div.panel-heading').html(panelHeader);
    if (paramsCounter < paramsList.length) {
        addInstructorByAjaxRecursively(); // eslint-disable-line no-use-before-define
    } else {
        enableAddInstructorForm();
    }
}

/**
 * Sends Ajax request to add new instructor(s).
 * It only sends another Ajax request after it finishes.
 */
function addInstructorByAjaxRecursively() {
    $.ajax({
        type: 'POST',
        url: '/admin/adminInstructorAccountAdd?' + paramsList[paramsCounter],
        beforeSend: disableAddInstructorForm,
        error: function error() {
            addInstructorAjax(true, null);
        },
        success: function success(data) {
            addInstructorAjax(false, data);
        }
    });
}

/**
 * Reads information of instructor(s) from the first panel and adds each instructor one by one.
 */
function addInstructorFromFirstFormByAjax() {
    $('#addInstructorResultPanel').show(); // show the hidden panel
    isInputFromFirstPanel = true;

    var multipleLineText = $('#addInstructorDetailsSingleLine').val(); // get input from the first panel
    multipleLineText = multipleLineText.trim();
    if (multipleLineText.length > 0) {
        instructorDetailsList = multipleLineText.split('\n');
        paramsList = [];
        for (var i = 0; i < instructorDetailsList.length; i += 1) {
            instructorDetailsList[i] = instructorDetailsList[i].replace(/\t/g, '|');
            paramsList[i] = 'instructordetailssingleline=' + encodeURIComponent(instructorDetailsList[i]);
        }
    }
    paramsCounter = 0;
    $('#addInstructorResultTable tbody').html(''); // clear table
    $('#addInstructorDetailsSingleLine').val(''); // clear input form
    $('#addInstructorResultPanel div.panel-heading').html('<strong>Result</strong>'); // clear panel header
    if (paramsList.length > 0) {
        addInstructorByAjaxRecursively();
    }
}

/**
 * Reads information of the instructor from the second panel then add him/her.
 */
function addInstructorFromSecondFormByAjax() {
    $('#addInstructorResultPanel').show(); // show the hidden panel
    isInputFromFirstPanel = false;

    var instructorDetails = encodeURIComponent($('#instructorName').val() + '|' + $('#instructorEmail').val() + '|' + $('#instructorInstitution').val());
    instructorDetailsList = [instructorDetails];
    var params = $.param({
        instructorshortname: $('#instructorShortName').val(),
        instructorname: $('#instructorName').val(),
        instructoremail: $('#instructorEmail').val(),
        instructorinstitution: $('#instructorInstitution').val()
    });
    paramsList = [params];

    paramsCounter = 0;
    $('#addInstructorResultTable tbody').html(''); // clear table
    $('#addInstructorResultPanel div.panel-heading').html('<strong>Result</strong>'); // clear panel header
    addInstructorByAjaxRecursively();
}

/*
export default {
    addInstructorFromFirstFormByAjax,
    addInstructorFromSecondFormByAjax,
};
*/
/* exported addInstructorFromFirstFormByAjax, addInstructorFromSecondFormByAjax */
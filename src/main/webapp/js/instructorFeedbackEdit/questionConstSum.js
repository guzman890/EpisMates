'use strict';

/* global
FEEDBACK_QUESTION_CONSTSUMPOINTS:false, FEEDBACK_QUESTION_CONSTSUMPOINTSFOREACHOPTION:false
FEEDBACK_QUESTION_CONSTSUMPOINTSFOREACHRECIPIENT:false, FEEDBACK_QUESTION_CONSTSUMOPTION:false
FEEDBACK_QUESTION_NUMBEROFCHOICECREATED:false, FEEDBACK_QUESTION_CONSTSUMOPTIONTABLE:false
*/

function updateConstSumPointsValue(questionNum) {
    if ($('#' + FEEDBACK_QUESTION_CONSTSUMPOINTS + '-' + questionNum).val() < 1) {
        $('#' + FEEDBACK_QUESTION_CONSTSUMPOINTS + '-' + questionNum).val(1);
    }
    if ($('#' + FEEDBACK_QUESTION_CONSTSUMPOINTSFOREACHOPTION + '-' + questionNum).val() < 1) {
        $('#' + FEEDBACK_QUESTION_CONSTSUMPOINTSFOREACHOPTION + '-' + questionNum).val(1);
    }
    if ($('#' + FEEDBACK_QUESTION_CONSTSUMPOINTSFOREACHRECIPIENT + '-' + questionNum).val() < 1) {
        $('#' + FEEDBACK_QUESTION_CONSTSUMPOINTSFOREACHRECIPIENT + '-' + questionNum).val(1);
    }
}

function addConstSumOption(questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var curNumberOfChoiceCreated = parseInt($('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(), 10);

    $('\n    <div class="margin-bottom-7px" id="constSumOptionRow-' + curNumberOfChoiceCreated + '-' + questionNum + '">\n        <div class="input-group width-100-pc">\n            <input type="text" name="' + FEEDBACK_QUESTION_CONSTSUMOPTION + '-' + curNumberOfChoiceCreated + '"\n                    id="' + FEEDBACK_QUESTION_CONSTSUMOPTION + '-' + curNumberOfChoiceCreated + '-' + questionNum + '"\n                    class="form-control constSumOptionTextBox">\n            <span class="input-group-btn">\n                <button class="btn btn-default removeOptionLink" id="constSumRemoveOptionLink"\n                        onclick="removeConstSumOption(' + curNumberOfChoiceCreated + ', ' + questionNum + ')"\n                        tabindex="-1">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </button>\n            </span>\n        </div>\n    </div>\n    ').insertBefore($('#constSumAddOptionRow-' + questionNum));

    $('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(curNumberOfChoiceCreated + 1);

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function hideConstSumOptionTable(questionNum) {
    $('#' + FEEDBACK_QUESTION_CONSTSUMOPTIONTABLE + '-' + questionNum).hide();
}

function removeConstSumOption(index, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;
    var $thisRow = $('#constSumOptionRow-' + index + '-' + questionNum);

    // count number of child rows the table have and - 1 because of add option button
    var numberOfOptions = $thisRow.parent().children('div').length - 1;

    if (numberOfOptions <= 1) {
        $thisRow.find('input').val('');
    } else {
        $thisRow.remove();

        if ($(questionId).attr('editStatus') === 'hasResponses') {
            $(questionId).attr('editStatus', 'mustDeleteResponses');
        }
    }
}

/* exported
updateConstSumPointsValue, addConstSumOption, hideConstSumOptionTable, removeConstSumOption
*/
'use strict';

/* global
FEEDBACK_QUESTION_RANKPOINTS:false, FEEDBACK_QUESTION_RANKOPTION:false, FEEDBACK_QUESTION_RANKOPTIONTABLE:false
FEEDBACK_QUESTION_NUMBEROFCHOICECREATED:false
*/

function updateRankPointsValue(questionNum) {
    if ($('#' + FEEDBACK_QUESTION_RANKPOINTS + '-' + questionNum).val() < 1) {
        $('#' + FEEDBACK_QUESTION_RANKPOINTS + '-' + questionNum).val(1);
    }
}

function addRankOption(questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var curNumberOfChoiceCreated = parseInt($('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(), 10);

    $('\n    <div id="rankOptionRow-' + curNumberOfChoiceCreated + '-' + questionNum + '">\n        <div class="input-group">\n            <input type="text" name="' + FEEDBACK_QUESTION_RANKOPTION + '-' + curNumberOfChoiceCreated + '"\n                    id="' + FEEDBACK_QUESTION_RANKOPTION + '-' + curNumberOfChoiceCreated + '-' + questionNum + '"\n                    class="form-control rankOptionTextBox">\n            <span class="input-group-btn">\n                <button class="btn btn-default removeOptionLink" id="rankRemoveOptionLink"\n                        onclick="removeRankOption(' + curNumberOfChoiceCreated + ', ' + questionNum + ')" tabindex="-1">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </button>\n            </span>\n        </div>\n    </div>\n    ').insertBefore($('#rankAddOptionRow-' + questionNum));

    $('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(curNumberOfChoiceCreated + 1);

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function hideRankOptionTable(questionNum) {
    $('#' + FEEDBACK_QUESTION_RANKOPTIONTABLE + '-' + questionNum).hide();
}

function removeRankOption(index, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;
    var $thisRow = $('#rankOptionRow-' + index + '-' + questionNum);

    // count number of child rows the table have and - 1 because of 'add option' button
    var numberOfOptions = $thisRow.parent().children('div').length - 1;

    if (numberOfOptions <= 2) {
        $thisRow.find('input').val('');
    } else {
        $thisRow.remove();

        if ($(questionId).attr('editStatus') === 'hasResponses') {
            $(questionId).attr('editStatus', 'mustDeleteResponses');
        }
    }
}

/* exported
updateRankPointsValue, addRankOption, hideRankOptionTable, removeRankOption
*/
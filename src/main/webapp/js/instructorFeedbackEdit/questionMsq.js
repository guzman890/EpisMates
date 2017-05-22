'use strict';

/* global
FEEDBACK_QUESTION_NUMBEROFCHOICECREATED:false, FEEDBACK_QUESTION_MSQCHOICE:false
*/

function addMsqOption(questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var curNumberOfChoiceCreated = parseInt($('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(), 10);

    $('\n    <div id="msqOptionRow-' + curNumberOfChoiceCreated + '-' + questionNum + '">\n        <div class="input-group">\n            <span class="input-group-addon">\n                <input type="checkbox" disabled>\n            </span>\n            <input type="text" name="' + FEEDBACK_QUESTION_MSQCHOICE + '-' + curNumberOfChoiceCreated + '"\n                    id="' + FEEDBACK_QUESTION_MSQCHOICE + '-' + curNumberOfChoiceCreated + '-' + questionNum + '"\n                    class="form-control msqOptionTextBox">\n            <span class="input-group-btn">\n                <button type="button" class="btn btn-default removeOptionLink" id="msqRemoveOptionLink"\n                        onclick="removeMsqOption(' + curNumberOfChoiceCreated + ', ' + questionNum + ')" tabindex="-1">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </button>\n            </span>\n        </div>\n    </div>\n    ').insertBefore($('#msqAddOptionRow-' + questionNum));

    $('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(curNumberOfChoiceCreated + 1);

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function removeMsqOption(index, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var $thisRow = $('#msqOptionRow-' + index + '-' + questionNum);

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

function toggleMsqGeneratedOptions(checkbox, questionNum) {
    if (checkbox.checked) {
        $('#msqChoiceTable-' + questionNum).find('input[type=text]').prop('disabled', true);
        $('#msqChoiceTable-' + questionNum).hide();
        $('#msqGenerateForSelect-' + questionNum).prop('disabled', false);
        $('#msqOtherOptionFlag-' + questionNum).closest('.checkbox').hide();
        $('#generatedOptions-' + questionNum).attr('value', $('#msqGenerateForSelect-' + questionNum).prop('value'));
    } else {
        $('#msqChoiceTable-' + questionNum).find('input[type=text]').prop('disabled', false);
        $('#msqChoiceTable-' + questionNum).show();
        $('#msqGenerateForSelect-' + questionNum).prop('disabled', true);
        $('#msqOtherOptionFlag-' + questionNum).closest('.checkbox').show();
        $('#generatedOptions-' + questionNum).attr('value', 'NONE');
    }
}

function changeMsqGenerateFor(questionNum) {
    $('#generatedOptions-' + questionNum).attr('value', $('#msqGenerateForSelect-' + questionNum).prop('value'));
}

/* exported
addMsqOption, removeMsqOption, toggleMsqGeneratedOptions, changeMsqGenerateFor
*/
'use strict';

/* global
FEEDBACK_QUESTION_NUMBEROFCHOICECREATED:false, FEEDBACK_QUESTION_MCQCHOICE:false
*/

function addMcqOption(questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var curNumberOfChoiceCreated = parseInt($('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(), 10);

    $('\n    <div id="mcqOptionRow-' + curNumberOfChoiceCreated + '-' + questionNum + '">\n        <div class="input-group">\n            <span class="input-group-addon">\n                <input type="radio" disabled>\n            </span>\n            <input type="text" name="' + FEEDBACK_QUESTION_MCQCHOICE + '-' + curNumberOfChoiceCreated + '"\n                    id="' + FEEDBACK_QUESTION_MCQCHOICE + '-' + curNumberOfChoiceCreated + '-' + questionNum + '"\n                    class="form-control mcqOptionTextBox">\n            <span class="input-group-btn">\n                <button type="button" class="btn btn-default removeOptionLink" id="mcqRemoveOptionLink"\n                        onclick="removeMcqOption(' + curNumberOfChoiceCreated + ', ' + questionNum + ')" tabindex="-1">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </button>\n            </span>\n        </div>\n    </div>\n    ').insertBefore($('#mcqAddOptionRow-' + questionNum));

    $('#' + FEEDBACK_QUESTION_NUMBEROFCHOICECREATED + '-' + questionNum).val(curNumberOfChoiceCreated + 1);

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function removeMcqOption(index, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var $thisRow = $('#mcqOptionRow-' + index + '-' + questionNum);

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

function toggleMcqGeneratedOptions(checkbox, questionNum) {
    if (checkbox.checked) {
        $('#mcqChoiceTable-' + questionNum).find('input[type=text]').prop('disabled', true);
        $('#mcqChoiceTable-' + questionNum).hide();
        $('#mcqGenerateForSelect-' + questionNum).prop('disabled', false);
        $('#mcqOtherOptionFlag-' + questionNum).closest('.checkbox').hide();
        $('#generatedOptions-' + questionNum).attr('value', $('#mcqGenerateForSelect-' + questionNum).prop('value'));
    } else {
        $('#mcqChoiceTable-' + questionNum).find('input[type=text]').prop('disabled', false);
        $('#mcqChoiceTable-' + questionNum).show();
        $('#mcqGenerateForSelect-' + questionNum).prop('disabled', true);
        $('#mcqOtherOptionFlag-' + questionNum).closest('.checkbox').show();
        $('#generatedOptions-' + questionNum).attr('value', 'NONE');
    }
}

function toggleMcqOtherOptionEnabled(checkbox, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function changeMcqGenerateFor(questionNum) {
    $('#generatedOptions-' + questionNum).attr('value', $('#mcqGenerateForSelect-' + questionNum).prop('value'));
}

/* exported
addMcqOption, removeMcqOption, toggleMcqGeneratedOptions, toggleMcqOtherOptionEnabled, changeMcqGenerateFor
*/
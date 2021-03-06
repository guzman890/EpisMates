'use strict';

/* global
disallowNonNumericEntries:false, BootboxWrapper:false, StatusType:false
*/

function addRubricRow(questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var numberOfRows = parseInt($('#rubricNumRows-' + questionNum).val(), 10);
    var numberOfCols = parseInt($('#rubricNumCols-' + questionNum).val(), 10);

    var newRowNumber = numberOfRows + 1;

    var rubricRowBodyFragments = '';
    // Create numberOfCols of <td>'s
    for (var cols = 0; cols < numberOfCols; cols += 1) {
        if (!$('.rubricCol-' + questionNum + '-' + cols).length) {
            continue;
        }
        var rubricRowFragment = '<td class="align-center rubricCol-' + questionNum + '-' + cols + '">\n                <textarea class="form-control" rows="3" id="rubricDesc-' + questionNum + '-' + (newRowNumber - 1) + '-' + cols + '"\n                        name="rubricDesc-' + (newRowNumber - 1) + '-' + cols + '">\n                </textarea>\n            </td>';
        rubricRowBodyFragments += rubricRowFragment;
    }

    // Create new rubric row
    var newRubricRow = '<tr id="rubricRow-' + questionNum + '-' + (newRowNumber - 1) + '">\n            <td>\n                <div class="col-sm-12 input-group">\n                    <span class="input-group-addon btn btn-default rubricRemoveSubQuestionLink-' + questionNum + '"\n                            id="rubricRemoveSubQuestionLink-' + questionNum + '-' + (newRowNumber - 1) + '"\n                            onclick="removeRubricRow(' + (newRowNumber - 1) + ', ' + questionNum + ')"\n                            onmouseover="highlightRubricRow(' + (newRowNumber - 1) + ', ' + questionNum + ', true)"\n                            onmouseout="highlightRubricRow(' + (newRowNumber - 1) + ', ' + questionNum + ', false)">\n                        <span class="glyphicon glyphicon-remove"></span>\n                    </span>\n                    <textarea class="form-control" rows="3" id="rubricSubQn-' + questionNum + '-' + (newRowNumber - 1) + '"\n                            name="rubricSubQn-' + (newRowNumber - 1) + '">\n                    </textarea>\n                </div>\n            </td>\n            ' + rubricRowBodyFragments + '\n        </tr>';

    // Row to insert new row after
    var lastRow = $('#rubricEditTable-' + questionNum + ' tr:last');
    $(newRubricRow).insertAfter(lastRow);

    // Increment
    $('#rubricNumRows-' + questionNum).val(newRowNumber);

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function addRubricCol(questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var numberOfRows = parseInt($('#rubricNumRows-' + questionNum).val(), 10);
    var numberOfCols = parseInt($('#rubricNumCols-' + questionNum).val(), 10);

    var newColNumber = numberOfCols + 1;

    // Insert header <th>
    var rubricHeaderFragment = '<th class="rubricCol-' + questionNum + '-' + (newColNumber - 1) + '">\n            <div class="input-group">\n                <input type="text" class="col-sm-12 form-control" value=""\n                        id="rubricChoice-' + questionNum + '-' + (newColNumber - 1) + '"\n                        name="rubricChoice-' + (newColNumber - 1) + '">\n                <span class="input-group-addon btn btn-default rubricRemoveChoiceLink-' + questionNum + '"\n                        id="rubricRemoveChoiceLink-' + questionNum + '-' + (newColNumber - 1) + '"\n                        onclick="removeRubricCol(' + (newColNumber - 1) + ', ' + questionNum + ')"\n                        onmouseover="highlightRubricCol(' + (newColNumber - 1) + ', ' + questionNum + ', true)"\n                        onmouseout="highlightRubricCol(' + (newColNumber - 1) + ', ' + questionNum + ', false)">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </span>\n            </div>\n        </th>';

    // Insert after last <th>
    var lastTh = $('#rubricEditTable-' + questionNum).find('tr:first').children().last();
    $(rubricHeaderFragment).insertAfter(lastTh);

    // Insert weight <th>
    var rubricWeightFragment = '<th class="rubricCol-' + questionNum + '-' + (newColNumber - 1) + '">\n            <input type="number" class="form-control nonDestructive" value="0"\n                    id="rubricWeight-' + questionNum + '-' + (newColNumber - 1) + '"\n                    name="rubricWeight-' + (newColNumber - 1) + '" step="0.01">\n        </th>';

    // Insert after last <th>
    var lastWeightCell = $('#rubricWeights-' + questionNum + ' th:last');
    $(rubricWeightFragment).insertAfter(lastWeightCell);

    disallowNonNumericEntries($('#rubricWeight-' + questionNum + '-' + (newColNumber - 1)), true, true);

    // Create numberOfRows of <td>'s
    for (var rows = 0; rows < numberOfRows; rows += 1) {
        if (!$('#rubricRow-' + questionNum + '-' + rows).length) {
            continue;
        }
        // Insert body <td>'s
        var rubricRowFragment = '<td class="align-center rubricCol-' + questionNum + '-' + (newColNumber - 1) + '">\n                <textarea class="form-control" rows="3" id="rubricDesc-' + questionNum + '-' + rows + '-' + (newColNumber - 1) + '"\n                        name="rubricDesc-' + rows + '-' + (newColNumber - 1) + '">\n                </textarea>\n            </td>';

        // Insert after previous <td>
        var lastTd = $('#rubricRow-' + questionNum + '-' + rows + ' td:last');
        $(rubricRowFragment).insertAfter(lastTd);
    }

    // Increment
    $('#rubricNumCols-' + questionNum).val(newColNumber);

    if ($(questionId).attr('editStatus') === 'hasResponses') {
        $(questionId).attr('editStatus', 'mustDeleteResponses');
    }
}

function removeRubricRow(index, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var $thisRow = $('#rubricRow-' + questionNum + '-' + index);

    // count number of table rows from table body
    var numberOfRows = $thisRow.parent().children('tr').length;

    var delStr = numberOfRows <= 1 ? 'clear' : 'delete';
    var messageText = 'Are you sure you want to ' + delStr + ' the row?';
    var okCallback = function okCallback() {
        if (numberOfRows <= 1) {
            $thisRow.find('textarea').val('');
        } else {
            $thisRow.remove();

            if ($(questionId).attr('editStatus') === 'hasResponses') {
                $(questionId).attr('editStatus', 'mustDeleteResponses');
            }
        }
    };
    BootboxWrapper.showModalConfirmation('Confirm Deletion', messageText, okCallback, null, BootboxWrapper.DEFAULT_OK_TEXT, BootboxWrapper.DEFAULT_CANCEL_TEXT, StatusType.WARNING);
}

function removeRubricCol(index, questionNum) {
    var questionId = '#form_editquestion-' + questionNum;

    var $thisCol = $('.rubricCol-' + questionNum + '-' + index);

    // count number of table columns from table body
    var numberOfCols = $thisCol.first().parent().children().length - 1;

    var delStr = numberOfCols <= 1 ? 'clear' : 'delete';
    var messageText = 'Are you sure you want to ' + delStr + ' the column?';
    var okCallback = function okCallback() {
        if (numberOfCols <= 1) {
            $thisCol.find('input[id^="rubricChoice"], textarea').val('');
            $thisCol.find('input[id^="rubricWeight"]').val(0);
        } else {
            $thisCol.remove();

            if ($(questionId).attr('editStatus') === 'hasResponses') {
                $(questionId).attr('editStatus', 'mustDeleteResponses');
            }
        }
    };
    BootboxWrapper.showModalConfirmation('Confirm Deletion', messageText, okCallback, null, BootboxWrapper.DEFAULT_OK_TEXT, BootboxWrapper.DEFAULT_CANCEL_TEXT, StatusType.WARNING);
}

function highlightRubricRow(index, questionNum, highlight) {
    var $rubricRow = $('#rubricRow-' + questionNum + '-' + index);

    if (highlight) {
        $rubricRow.find('td').addClass('cell-selected-negative');
    } else {
        $rubricRow.find('td').removeClass('cell-selected-negative');
    }
}

function highlightRubricCol(index, questionNum, highlight) {
    var $rubricCol = $('.rubricCol-' + questionNum + '-' + index);

    if (highlight) {
        $rubricCol.addClass('cell-selected-negative');
    } else {
        $rubricCol.removeClass('cell-selected-negative');
    }
}

/**
 * Moves the "weights" checkbox to the weight row if it is checked, otherwise
 * moves it to the choice row
 *
 * @param checkbox the "weights" checkbox
 */
function moveAssignWeightsCheckbox(checkbox) {
    var $choicesRow = checkbox.closest('thead').find('tr').eq(0);
    var $weightsRow = checkbox.closest('thead').find('tr').eq(1);
    var $choicesRowFirstCell = $choicesRow.find('th').first();
    var $weightsRowFirstCell = $weightsRow.find('th').first();

    var $checkboxCellContent = checkbox.closest('th').children().detach();

    $choicesRowFirstCell.empty();
    $weightsRowFirstCell.empty();

    if (checkbox.prop('checked')) {
        $choicesRowFirstCell.append('Choices <span class="glyphicon glyphicon-arrow-right"></span>');
        $weightsRowFirstCell.append($checkboxCellContent);
        $weightsRowFirstCell.find('.glyphicon-arrow-right').show();
    } else {
        $choicesRowFirstCell.append($checkboxCellContent);
        $choicesRowFirstCell.find('.glyphicon-arrow-right').hide();
    }
}

/**
 * Attaches event handlers to "weights" checkboxes to toggle the visibility of
 * the input boxes for rubric weights and move the "weights" checkbox to the
 * appropriate location
 */
function bindAssignWeightsCheckboxes() {
    $('body').on('click', 'input[id^="rubricAssignWeights"]', function () {
        var $checkbox = $(this);

        $checkbox.closest('form').find('tr[id^="rubricWeights"]').toggle();

        moveAssignWeightsCheckbox($checkbox);
    });
}

/**
 * @param questionNum
 *            the question number of the feedback question
 * @returns {Boolean} true if the weights are assigned by the user, otherwise false
 */
function hasAssignedWeights(questionNum) {
    return $('#rubricAssignWeights-' + questionNum).prop('checked');
}

/* exported
addRubricRow, addRubricCol, removeRubricRow, removeRubricCol, highlightRubricRow, highlightRubricCol
bindAssignWeightsCheckboxes, hasAssignedWeights
*/
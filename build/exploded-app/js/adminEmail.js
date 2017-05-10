'use strict';

/* global StatusType:false setStatusMessage:false toggleSort:false richTextEditorBuilder:false */

// Form input placeholders
var PLACEHOLDER_IMAGE_UPLOAD_ALT_TEXT = 'Please enter an alt text for the image';

var callbackFunction = void 0;

function setErrorMessage(message) {
    setStatusMessage(message, StatusType.DANGER);
}

function showUploadingGif() {
    setStatusMessage("Uploading...<span><img src='/images/ajax-loader.gif'/></span>", StatusType.WARNING);
}

function createGroupReceiverListUploadUrl() {
    $.ajax({
        type: 'POST',
        url: '/admin/adminEmailCreateGroupReceiverListUploadUrl',
        beforeSend: function beforeSend() {
            showUploadingGif();
        },
        error: function error() {
            setErrorMessage('URL request failured, please try again.');
        },
        success: function success(data) {
            setTimeout(function () {
                if (data.isError) {
                    setErrorMessage(data.ajaxStatus);
                } else {
                    $('#adminEmailReceiverListForm').attr('action', data.nextUploadUrl);
                    setStatusMessage(data.ajaxStatus);
                    submitGroupReceiverListUploadFormAjax(); // eslint-disable-line no-use-before-define
                }
            }, 500);
        }
    });
}

function clearUploadGroupReceiverListInfo() {
    $('#adminEmailGroupReceiverListInput').html('<input type="file" name="emailgroupreceiverlisttoupload" ' + 'id="adminEmailGroupReceiverList">');
    $('#adminEmailGroupReceiverList').on('change paste keyup', function () {
        createGroupReceiverListUploadUrl();
    });
}

function submitGroupReceiverListUploadFormAjax() {
    var formData = new FormData($('#adminEmailReceiverListForm')[0]);

    $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        url: $('#adminEmailReceiverListForm').attr('action'),
        data: formData,
        // Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false,

        beforeSend: function beforeSend() {
            showUploadingGif();
        },
        error: function error() {
            setErrorMessage('Group receiver list upload failed, please try again.');
            clearUploadGroupReceiverListInfo();
        },
        success: function success(data) {
            setTimeout(function () {
                if (data.isError) {
                    setErrorMessage(data.ajaxStatus);
                } else if (data.isFileUploaded) {
                    setStatusMessage(data.ajaxStatus, StatusType.SUCCESS);
                    $('#groupReceiverListFileKey').val(data.groupReceiverListFileKey);
                    $('#groupReceiverListFileKey').show();
                    $('#groupReceiverListFileSize').val(data.groupReceiverListFileSize);
                } else {
                    setErrorMessage(data.ajaxStatus);
                }
            }, 500);
        }
    });
    clearUploadGroupReceiverListInfo();
}

function clearUploadFileInfo() {
    $('#adminEmailFileInput').html('<input type="file" name="emailimagetoupload" id="adminEmailFile">');
    $('#adminEmailFile').on('change paste keyup', function () {
        createImageUploadUrl(); // eslint-disable-line no-use-before-define
    });
}

function submitImageUploadFormAjax() {
    var formData = new FormData($('#adminEmailFileForm')[0]);

    $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        url: $('#adminEmailFileForm').attr('action'),
        data: formData,
        // Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false,

        beforeSend: function beforeSend() {
            showUploadingGif();
        },
        error: function error() {
            setErrorMessage('Image upload failed, please try again.');
            clearUploadFileInfo();
        },
        success: function success(data) {
            setTimeout(function () {
                if (data.isError) {
                    setErrorMessage(data.ajaxStatus);
                } else if (data.isFileUploaded) {
                    var url = data.fileSrcUrl;
                    callbackFunction(url, { alt: PLACEHOLDER_IMAGE_UPLOAD_ALT_TEXT });
                    setStatusMessage(data.ajaxStatus, StatusType.SUCCESS);
                } else {
                    setErrorMessage(data.ajaxStatus);
                }
            }, 500);
        }
    });
    clearUploadFileInfo();
}

function createImageUploadUrl() {
    $.ajax({
        type: 'POST',
        url: '/admin/adminEmailCreateImageUploadUrl',
        beforeSend: function beforeSend() {
            showUploadingGif();
        },
        error: function error() {
            setErrorMessage('URL request failured, please try again.');
        },
        success: function success(data) {
            setTimeout(function () {
                if (data.isError) {
                    setErrorMessage(data.ajaxStatus);
                } else {
                    $('#adminEmailFileForm').attr('action', data.nextUploadUrl);
                    setStatusMessage(data.ajaxStatus);
                    submitImageUploadFormAjax();
                }
            }, 500);
        }
    });
}

$(document).ready(function () {
    /* eslint-disable camelcase */ // The property names are determined by external library (tinymce)
    richTextEditorBuilder.initEditor('textarea', {
        document_base_url: $('#documentBaseUrl').text(),
        file_picker_callback: function file_picker_callback(callback, value, meta) {
            // Provide image and alt text for the image dialog
            if (meta.filetype === 'image') {
                $('#adminEmailFile').click();
                callbackFunction = callback;
            }
        }
    });
    /* eslint-enable camelcase */

    $('#adminEmailFile').on('change paste keyup', function () {
        createImageUploadUrl();
    });

    $('#adminEmailGroupReceiverList').on('change paste keyup', function () {
        createGroupReceiverListUploadUrl();
    });

    $('#adminEmailGroupReceiverListUploadButton').on('click', function () {
        $('#adminEmailGroupReceiverList').click();
    });

    $('#composeSaveButton').on('click', function () {
        $('#adminEmailMainForm').attr('action', '/admin/adminEmailComposeSave');
        $('#composeSubmitButton').click();
    });

    $('#addressReceiverEmails').on('change keyup', function (e) {
        if (e.which === 13) {
            $('#addressReceiverEmails').val($('#addressReceiverEmails').val() + ',');
        }
    });

    toggleSort($('#button_sort_date').parent());
});
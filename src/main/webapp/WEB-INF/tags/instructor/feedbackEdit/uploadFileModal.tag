<%@ tag description="File Upload" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ tag import="teammates.common.util.Const" %>
<%@ attribute name="modal" required="true" %>
<c:set var="DEFAULT_PROFILE_PICTURE_PATH" value="<%= Const.SystemParams.DEFAULT_PROFILE_PICTURE_PATH %>" />
<div class="modal fade"
     id="fileUploader"
     role="dialog"
     aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title">
                    Upload Files
                </h4>
            </div>
            <div class="modal-body center-block align-center">
                <br>
                <div class="row">
                    <div class="col-xs-4 profile-pic-edit-col">
                        <div class="center-block align-center">
                            <form id="feedbakFileUploadForm" method="post"> 
                                <span class="btn btn-primary profile-pic-file-selector">
                                    Browse...
                                    <input id="feedBackFileUpload"
                                           type="file"
                                           name="<%= Const.ParamsNames.STUDENT_PROFILE_PHOTO %>">
                                </span>
                                <input type="text" class="filename-preview" value="No File Selected" disabled>
                                <p class="help-block align-left">
                                    Max Size: 5 MB
                                </p>
                                <button type="button"
                                        id="feedbakFileUploadSubmit"
                                        class="btn btn-primary width-100-pc"
                                        disabled>
                                    Upload File
                                </button>
                            </form>
                        </div>
                    </div>
                </div><%-- /.row --%>
            </div><%-- /.modal-body --%>
            <div class="modal-footer">
            </div>
        </div><%-- /.modal-content --%>
    </div><%-- /.modal-dialog --%>
</div><%-- /.modal --%>
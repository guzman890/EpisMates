package teammates.ui.controller;

import teammates.common.datatransfer.attributes.CourseAttributes;
import teammates.common.exception.EntityDoesNotExistException;
import teammates.common.util.Assumption;
import teammates.common.util.Const;
import teammates.ui.pagedata.StudentCourseDetailsPageData;

public class StudentCourseDetailsPageAction extends Action {

    @Override
    public ActionResult execute() throws EntityDoesNotExistException {

        String courseId = getRequestParamValue(Const.ParamsNames.COURSE_ID);
        Assumption.assertNotNull(courseId);

        if (!isJoinedCourse(courseId)) {
            return createPleaseJoinCourseResponse(courseId);
        }

        CourseAttributes course = logic.getCourse(courseId);
        gateKeeper.verifyAccessible(logic.getStudentForGoogleId(courseId, account.googleId), course);

        StudentCourseDetailsPageData data =
                                        new StudentCourseDetailsPageData(account);

        data.init(logic.getCourseDetails(courseId), logic.getInstructorsForCourse(courseId),
                      logic.getStudentForGoogleId(courseId, account.googleId),
                      logic.getTeamDetailsForStudent(logic.getStudentForGoogleId(courseId, account.googleId)));

        statusToAdmin = "studentCourseDetails Page Load<br>"
                        + "Viewing team details for <span class=\"bold\">[" + courseId + "] "
                        + course.getName() + "</span>";

        return createShowPageResult(Const.ViewURIs.STUDENT_COURSE_DETAILS, data);
    }

}

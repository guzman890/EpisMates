package teammates.ui.automated;

import teammates.common.datatransfer.attributes.CourseAttributes;
import teammates.common.datatransfer.attributes.StudentAttributes;
import teammates.common.util.Assumption;
import teammates.common.util.Const.ParamsNames;
import teammates.common.util.EmailWrapper;
import teammates.logic.api.EmailGenerator;

/**
 * Task queue worker action: sends registration email for a student of a course.
 */
public class StudentCourseDeleteEmailWorkerAction extends AutomatedAction {

    @Override
    protected String getActionDescription() {
        return null;
    }

    @Override
    protected String getActionMessage() {
        return null;
    }

    @Override
    public void execute() {
        String courseId = getRequestParamValue(ParamsNames.COURSE_ID);
        Assumption.assertNotNull(courseId);
        String studentEmail = getRequestParamValue(ParamsNames.STUDENT_EMAIL);
        Assumption.assertNotNull(studentEmail);
        //String isRejoinString = getRequestParamValue(ParamsNames.IS_STUDENT_REJOINING);
        //Assumption.assertNotNull(isRejoinString);
        boolean isRejoin = false;

        CourseAttributes course = logic.getCourse(courseId);
        Assumption.assertNotNull(course);
        StudentAttributes student = logic.getStudentForEmail(courseId, studentEmail);
        Assumption.assertNotNull(student);

        EmailWrapper email = isRejoin
                ? new EmailGenerator().generateStudentCourseRejoinEmailAfterGoogleIdReset(course, student)
                : new EmailGenerator().generateStudentCourseDeleteEmail(course, student);
        try {
            emailSender.sendEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while sending email", e);
        }
    }

}

package teammates.ui.controller;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeMap;

import teammates.common.datatransfer.attributes.CourseAttributes;
import teammates.common.datatransfer.attributes.InstructorAttributes;
import teammates.common.datatransfer.attributes.StudentAttributes;
import teammates.common.exception.EntityDoesNotExistException;
import teammates.common.util.Assumption;
import teammates.common.util.Config;
import teammates.common.util.Const;
import teammates.common.util.StatusMessage;
import teammates.common.util.StatusMessageColor;
import teammates.common.util.StringHelper;
/**
 * Action: Delete a course for an instructor.
 */
public class InstructorCourseDeleteAction extends Action {

    @Override
    public ActionResult execute() {

        String idOfCourseToDelete = getRequestParamValue(Const.ParamsNames.COURSE_ID);
        Assumption.assertNotNull(idOfCourseToDelete);


          CourseAttributes course = logic.getCourse(idOfCourseToDelete);
        gateKeeper.verifyAccessible(logic.getInstructorForGoogleId(idOfCourseToDelete, account.googleId),
                                    logic.getCourse(idOfCourseToDelete),
                                    Const.ParamsNames.INSTRUCTOR_PERMISSION_MODIFY_COURSE);


         //EmailDelete
        
         Map<String, JoinEmailData> emailDataMap = new TreeMap<String, JoinEmailData>();
        //  boolean isSendingToStudent = null;
        //Shgdhdtj
          
           
        
            List<StudentAttributes> studentDataList = logic.getStudentsForCourse(idOfCourseToDelete);
            for (StudentAttributes student : studentDataList) {
               // taskQueuer.courseDeleteNot(course.getId(), student.getEmail(), false);
                taskQueuer.courseDeleteNotificationToStudent(course.getId(),student.getEmail());
               // taskQueuer.scheduleCourseRegistrationInviteToStudent(null,null,false);
                emailDataMap.put(student.getEmail(),
                        new JoinEmailData(student.getName(), extractStudentRegistrationKey(student)));
            }



        






           // statusToUser.add(new StatusMessage(Const.StatusMessages.COURSE_REMINDERS_SENT, StatusMessageColor.SUCCESS));
           // redirectUrl = Const.ActionURIs.INSTRUCTOR_COURSE_DETAILS_PAGE;


        /* Delete the course and setup status to be shown to user and admin */
        logic.deleteCourse(idOfCourseToDelete);
        String statusMessage = String.format(Const.StatusMessages.COURSE_DELETED, idOfCourseToDelete);
        statusToUser.add(new StatusMessage(statusMessage, StatusMessageColor.SUCCESS));
        statusToAdmin = "Course deleted: " + idOfCourseToDelete;

        if (isRedirectedToHomePage()) {
            return createRedirectResult(Const.ActionURIs.INSTRUCTOR_HOME_PAGE);
        }
        return createRedirectResult(Const.ActionURIs.INSTRUCTOR_COURSES_PAGE);
    }

/**
     * Checks if the action is executed in homepage or 'Courses' pages based on its redirection.
     */
    private boolean isRedirectedToHomePage() {
        String nextUrl = getRequestParamValue(Const.ParamsNames.NEXT_URL);
        return nextUrl != null && nextUrl.equals(Const.ActionURIs.INSTRUCTOR_HOME_PAGE);
    }

   private String extractStudentRegistrationKey(StudentAttributes student) {
        String joinLink = Config.getAppUrl(student.getRegistrationUrl()).toAbsoluteString();
        String keyParam = Const.ParamsNames.REGKEY + "=";
        int startIndex = joinLink.indexOf(keyParam) + keyParam.length();
        return joinLink.substring(startIndex);
    }





   private static class JoinEmailData {
        String userName;
        String regKey;

        JoinEmailData(String userName, String regKey) {
            this.userName = userName;
            this.regKey = regKey;
        }
    }
}





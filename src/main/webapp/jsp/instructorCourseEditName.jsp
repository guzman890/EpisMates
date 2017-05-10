<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="teammates.common.util.FrontEndLibrary" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<%@ taglib tagdir="/WEB-INF/tags/instructor" prefix="ti" %>
<%@ taglib tagdir="/WEB-INF/tags/instructor/course" prefix="course" %>

<c:set var="jsIncludes">
    <script type="text/javascript" src="<%= FrontEndLibrary.MOMENT %>"></script>
    <script type="text/javascript" src="<%= FrontEndLibrary.MOMENT_TIMEZONE %>"></script>
    <script type="text/javascript" src="/js/timezone.js"></script>
    <script type="text/javascript" src="/js/instructor.js"></script>
    <script type="text/javascript" src="/js/instructorCourseEdit.js"></script>
</c:set>

<ti:instructorPage pageTitle="TEAMMATES - Instructor" bodyTitle="Editar Atributos del Curso" jsIncludes="${jsIncludes}">
    <input type="hidden" id="course-time-zone" value="${data.course.timeZone}">
    <course:courseEditCourseInfo 
            editCourseButton="${data.editCourseButton}"
            deleteCourseButton="${data.deleteCourseButton}" 
            course="${data.course}" />
    <br>
    <t:statusMessage statusMessagesToUser="${data.statusMessagesToUser}" />
    <!--//richardz -->
    
</ti:instructorPage>

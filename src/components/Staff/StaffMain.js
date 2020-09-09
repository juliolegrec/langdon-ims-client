import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainNotFound from './Mains/MainNotFound';
import Dashboard from './Mains/Dashboard';
import StudentsView from './Mains/StudentsView';
import StudentView from './Mains/StudentView';
import TeachersView from './Mains/TeachersView';
import TeacherView from './Mains/TeacherView';
import NewStudent from './Mains/NewStudent';
import NewTeacher from './Mains/NewTeacher';
import SchoolInfo from './Mains/SchoolInfo';
import ClassHours from './Mains/ClassHours';
import SchoolCalendar from './Mains/SchoolCalendar';
import ClassesView from './Mains/ClassesView';
import NewClass from './Mains/ClassesView/NewClass';
import UpdateClass from './Mains/ClassesView/UpdateClass';
import SubjectsView from './Mains/SubjectsView';
import UpdateSubject from './Mains/SubjectsView/UpdateSubject';
import Assessments from './Mains/Assessments';
import NewAssessment from './Mains/Assessments/NewAssessment';
import UpdateAssessment from './Mains/Assessments/UpdateAssessment';
import Exams from './Mains/Exam';
import NewExam from './Mains/Exam/NewExam';
import UpdateExam from './Mains/Exam/UpdateExam';
import AssessmentMarkings from './Mains/AssessmentMarkings';
import ExamMarkings from './Mains/ExamMarkings';
import StudentAttendance from './Mains/StudentAttendance';
import TeacherAttendance from './Mains/TeacherAttendance';
import Timetable from './Mains/Timetable';
import UserAccount from './Mains/UserAccount';
import StaffsView from './Mains/Staffs';
import StaffView from './Mains/Staffs/StaffView';

import styled from 'styled-components';

const MainStyled = styled.div`
	width: 100%;
	height: calc(100vh - 50px);
	overflow: scroll;
	background: #f5f5f5;

	@media print {
		overflow: initial !important;
	}
`;

function StaffMain(props) {
	return (
		<MainStyled>
			<Switch>
				{props.role === 'ADMIN' ? (
					<Route exact path='/staff/admin/staffs' component={StaffsView} />
				) : (
					''
				)}
				{props.role === 'ADMIN' ? (
					<Route exact path='/staff/admin/staffs/:id' component={StaffView} />
				) : (
					''
				)}
				<Route exact path='/staff/' component={Dashboard} />
				<Route exact path='/staff/students' component={StudentsView} />
				<Route exact path='/staff/student/:id' component={StudentView} />
				<Route
					exact
					path='/staff/students/register-student'
					component={NewStudent}
				/>
				<Route exact path='/staff/teachers' component={TeachersView} />
				<Route exact path='/staff/teacher/:id' component={TeacherView} />
				<Route
					exact
					path='/staff/teachers/register-teacher'
					component={NewTeacher}
				/>
				<Route exact path='/staff/schoolinfo' component={SchoolInfo} />
				<Route exact path='/staff/classhours' component={ClassHours} />
				<Route exact path='/staff/schoolcalendar' component={SchoolCalendar} />
				<Route exact path='/staff/classes' component={ClassesView} />
				<Route exact path='/staff/classes/new-class' component={NewClass} />
				<Route
					exact
					path='/staff/classes/update-class/:id'
					component={UpdateClass}
				/>
				<Route exact path='/staff/subjects' component={SubjectsView} />
				<Route
					exact
					path='/staff/subjects/update-subject/:id'
					component={UpdateSubject}
				/>
				<Route exact path='/staff/assessments' component={Assessments} />
				<Route
					exact
					path='/staff/assessments/register-assessment'
					component={NewAssessment}
				/>
				<Route
					exact
					path='/staff/assessments/update-assessment/:id'
					component={UpdateAssessment}
				/>
				<Route exact path='/staff/finalexams' component={Exams} />
				<Route
					exact
					path='/staff/finalexams/register-exam'
					component={NewExam}
				/>
				<Route
					exact
					path='/staff/finalexams/update-exam/:id'
					component={UpdateExam}
				/>
				<Route
					exact
					path='/staff/assessment-markings'
					component={AssessmentMarkings}
				/>
				<Route exact path='/staff/exam-markings' component={ExamMarkings} />
				<Route
					exact
					path='/staff/student-attendance'
					component={StudentAttendance}
				/>
				<Route
					exact
					path='/staff/teacher-attendance'
					component={TeacherAttendance}
				/>
				<Route exact path='/staff/timetable' component={Timetable} />
				<Route exact path='/staff/user/:id' component={UserAccount} />
				<Route path='*' component={MainNotFound} />
			</Switch>
		</MainStyled>
	);
}

export default StaffMain;

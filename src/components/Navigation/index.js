import React from 'react';
// import AdminNav from './AdminNav';
import StaffNav from './StaffNav';
import TeacherNav from './TeacherNav';
import StudentNav from './StudentNav';

export default function Navigation(props) {
	switch (props.role) {
		case 'ADMIN':
		case 'STAFF':
			return <StaffNav role={props.role} />;
		case 'TEACHER':
			return <TeacherNav role={props.role} />;
		case 'STUDENT':
			return <StudentNav role={props.role} />;
		default:
			return <h1>Something went wrong....</h1>;
	}
}

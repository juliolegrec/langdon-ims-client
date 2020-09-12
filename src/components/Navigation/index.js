import React from 'react';
// import AdminNav from './AdminNav';
import StaffNav from './StaffNav';
import TeacherNav from './TeacherNav';
import StudentNav from './StudentNav';

function Navigation(props) {
	console.log(props);
	switch (props.role) {
		case 'ADMIN':
		case 'STAFF':
			return <StaffNav role={props.role} />;
		// break;
		case 'TEACHER':
			return <TeacherNav role={props.role} />;
		// break;
		case 'STUDENT':
			return <StudentNav role={props.role} />;
		// break;
		default:
			return <h1>Something went wrong....</h1>;
		// break;
	}
}

export default Navigation;

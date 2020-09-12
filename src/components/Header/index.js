import React from 'react';
import StaffHeader from './StaffHeader';
import StudentHeader from './StudentHeader';
import TeacherHeader from './TeacherHeader';

export default function Header(props) {
	const username = JSON.parse(
		localStorage.getItem('state')
	).sessionState.authUser.username.toString();

	switch (props.role) {
		case 'ADMIN':
		case 'STAFF':
			return <StaffHeader username={username} role={props.role} />;
		case 'TEACHER':
			return <TeacherHeader username={username} role={props.role} />;
		case 'STUDENT':
			return <StudentHeader username={username} role={props.role} />;
		default:
			return <h1>Something went wrong....</h1>;
	}
}

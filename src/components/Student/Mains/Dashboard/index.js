import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import TimetableWidget from './TimetableWidget';
import Calendars from './Calendars';

export default function Dashboard() {
	const username = JSON.parse(
		localStorage.getItem('state')
	).sessionState.authUser.username.toString();

	const STUDENT_INFO = gql`
		{
			findStudentFromUsername(username: "${username}") {
				_id
				studentID
				firstName
				lastName
				classID
			}
		}
	`;

	const {
		loading: loadingStudent,
		error: errorStudent,
		data: dataStudent,
	} = useQuery(STUDENT_INFO);

	if (loadingStudent) {
		return 'Loading';
	}
	if (errorStudent) {
		return 'Error';
	}

	const studentData = dataStudent.findStudentFromUsername;

	return (
		<StyledMain>
			<h2>Dashboard</h2>
			<TimetableWidget classID={studentData.classID} />
			<Calendars />
		</StyledMain>
	);
}

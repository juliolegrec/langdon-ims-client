import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import NavStyles from '../styles/NavStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTachometerAlt,
	faUserGraduate,
	// faChalkboardTeacher,
	// faTasks,
	// faCalendarWeek,
	// faChalkboard,
	// faBook,
	// faCalendarAlt,
	// faThList,
	// faSlidersH,
	// faInfoCircle,
	// faBusinessTime,
	// faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

function StudentNav() {
	const GET_SCHOOL_INFO = gql`
		{
			schoolInfo {
				name
				logo
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_SCHOOL_INFO);

	function schoolLogo() {
		if (loading) return 'Loading...';
		if (error) return `Error! ${error.message}`;

		return <img src={data.schoolInfo.logo} alt="Logo of college" />;
	}

	function schoolName() {
		if (loading) return 'Loading...';
		if (error) return 'Error!';

		return data.schoolInfo.name;
	}

	return (
		<NavStyles>
			<div className="logo-bg">{schoolLogo()}</div>
			<h3>{schoolName()}</h3>
			<ul className="list-group">
				<NavLink to="/student" exact activeClassName="current">
					<li>
						<FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
					</li>
				</NavLink>
				<NavLink to="/student/student-profile" exact activeClassName="current">
					<li>
						<FontAwesomeIcon icon={faUserGraduate} /> My Profile
					</li>
				</NavLink>
			</ul>
		</NavStyles>
	);
}

export default StudentNav;

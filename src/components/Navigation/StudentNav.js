import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import NavStyles from '../styles/NavStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTachometerAlt,
	faUserGraduate,
	// faChalkboardTeacher,
	// faTasks,
	faCalendarWeek,
	// faChalkboard,
	// faBook,
	// faCalendarAlt,
	faThList,
	// faSlidersH,
	// faInfoCircle,
	// faBusinessTime,
	// faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const SubmenuStyled = styled.li`
	list-style: none;
`;

function StudentNav() {
	const [OpenMarkingsMenu, setOpenMarkingsMenu] = useState(false);

	function toggleMarkingsMenu() {
		setOpenMarkingsMenu(!OpenMarkingsMenu);
	}

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

		return <img src={data.schoolInfo.logo} alt='Logo of college' />;
	}

	function schoolName() {
		if (loading) return 'Loading...';
		if (error) return 'Error!';

		return data.schoolInfo.name;
	}

	return (
		<NavStyles id='react-no-print'>
			<div className='logo-bg'>{schoolLogo()}</div>
			<h3>{schoolName()}</h3>
			<ul className='list-group'>
				<NavLink to='/student' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
					</li>
				</NavLink>
				<NavLink to='/student/student-profile' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faUserGraduate} /> My Profile
					</li>
				</NavLink>
				<NavLink to='/student/timetable' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faCalendarWeek} /> My Timetable
					</li>
				</NavLink>
				<li className='has-submenu' onClick={toggleMarkingsMenu}>
					<FontAwesomeIcon icon={faThList} /> My Marks <ExpandMoreIcon />
					<ul className={OpenMarkingsMenu ? 'visible' : ''}>
						<NavLink
							to='/student/assessment-markings'
							exact
							activeClassName='current'
						>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faThList} /> My Assessments Marks
							</SubmenuStyled>
						</NavLink>
						<NavLink
							to='/student/exam-markings'
							exact
							activeClassName='current'
						>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faThList} /> My Exams Marks
							</SubmenuStyled>
						</NavLink>
					</ul>
				</li>
			</ul>
		</NavStyles>
	);
}

export default StudentNav;

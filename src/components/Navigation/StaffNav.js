import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavStyles from '../styles/NavStyles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTachometerAlt,
	faUserGraduate,
	faChalkboardTeacher,
	faTasks,
	faCalendarWeek,
	faChalkboard,
	faBook,
	faCalendarAlt,
	faThList,
	faSlidersH,
	faInfoCircle,
	faBusinessTime,
	faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

const SubmenuStyled = styled.li`
	list-style: none;
`;

export default function StaffNav(props) {
	const [OpenClassMenu, setOpenClassMenu] = useState(false);
	const [OpenSettingsMenu, setOpenSettingsMenu] = useState(false);
	const [OpenExamsMenu, setOpenExamsMenu] = useState(false);
	const [OpenMarkingsMenu, setOpenMarkingsMenu] = useState(false);
	const [OpenAttendanceMenu, setOpenAttendanceMenu] = useState(false);

	function toggleClassMenu() {
		setOpenClassMenu(!OpenClassMenu);
	}

	function toggleSettingsMenu() {
		setOpenSettingsMenu(!OpenSettingsMenu);
	}
	function toggleExamsMenu() {
		setOpenExamsMenu(!OpenExamsMenu);
	}
	function toggleMarkingsMenu() {
		setOpenMarkingsMenu(!OpenMarkingsMenu);
	}
	function toggleAttendanceMenu() {
		setOpenAttendanceMenu(!OpenAttendanceMenu);
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
				<NavLink to='/staff' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
					</li>
				</NavLink>
				<li className='has-submenu' onClick={toggleAttendanceMenu}>
					<FontAwesomeIcon icon={faTasks} /> Attendance <ExpandMoreIcon />
					<ul className={OpenAttendanceMenu ? 'visible' : ''}>
						<NavLink
							to='/staff/student-attendance'
							exact
							activeClassName='current'
						>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faTasks} /> Student Attendance
							</SubmenuStyled>
						</NavLink>
						<NavLink
							to='/staff/teacher-attendance'
							exact
							activeClassName='current'
						>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faTasks} /> Teacher Attendance
							</SubmenuStyled>
						</NavLink>
					</ul>
				</li>
				<NavLink to='/staff/timetable' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faCalendarWeek} /> Timetable
					</li>
				</NavLink>
				{props.role === 'ADMIN' ? (
					<NavLink to='/staff/admin/staffs' exact activeClassName='current'>
						<li>
							<FontAwesomeIcon icon={faUserFriends} /> Staff
						</li>
					</NavLink>
				) : (
					''
				)}
				<NavLink to='/staff/students' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faUserGraduate} /> Student
					</li>
				</NavLink>
				<NavLink to='/staff/teachers' exact activeClassName='current'>
					<li>
						<FontAwesomeIcon icon={faChalkboardTeacher} /> Teacher
					</li>
				</NavLink>
				<li className='has-submenu' onClick={toggleClassMenu}>
					<FontAwesomeIcon icon={faChalkboard} /> Classes <ExpandMoreIcon />
					<ul className={OpenClassMenu ? 'visible' : ''}>
						<NavLink to='/staff/classes' exact activeClassName='current'>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faChalkboard} /> Classes
							</SubmenuStyled>
						</NavLink>
						<NavLink to='/staff/subjects' exact activeClassName='current'>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faBook} /> Subjects
							</SubmenuStyled>
						</NavLink>
					</ul>
				</li>
				<li className='has-submenu' onClick={toggleExamsMenu}>
					<FontAwesomeIcon icon={faCalendarAlt} /> Examination{' '}
					<ExpandMoreIcon />
					<ul className={OpenExamsMenu ? 'visible' : ''}>
						<NavLink to='/staff/assessments' exact activeClassName='current'>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faCalendarAlt} /> Assessments Schedule
							</SubmenuStyled>
						</NavLink>
						<NavLink to='/staff/finalexams' exact activeClassName='current'>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faCalendarAlt} /> Final Exams Schedule
							</SubmenuStyled>
						</NavLink>
					</ul>
				</li>
				<li className='has-submenu' onClick={toggleMarkingsMenu}>
					<FontAwesomeIcon icon={faThList} /> Markings <ExpandMoreIcon />
					<ul className={OpenMarkingsMenu ? 'visible' : ''}>
						<NavLink
							to='/staff/assessment-markings'
							exact
							activeClassName='current'
						>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faThList} /> Assessments
							</SubmenuStyled>
						</NavLink>
						<NavLink to='/staff/exam-markings' exact activeClassName='current'>
							<SubmenuStyled>
								<FontAwesomeIcon icon={faThList} /> Exams
							</SubmenuStyled>
						</NavLink>
					</ul>
				</li>

				<li className='has-submenu' onClick={toggleSettingsMenu}>
					<FontAwesomeIcon icon={faSlidersH} /> General Settings{' '}
					<ExpandMoreIcon />
					<ul
						style={{ listStyle: 'none' }}
						className={OpenSettingsMenu ? 'visible' : ''}
					>
						<NavLink to='/staff/schoolinfo' exact activeClassName='current'>
							<li>
								<FontAwesomeIcon icon={faInfoCircle} /> School Info
							</li>
						</NavLink>
						<NavLink to='/staff/schoolcalendar' exact activeClassName='current'>
							<li>
								<FontAwesomeIcon icon={faCalendarAlt} /> School Calendar
							</li>
						</NavLink>
						<NavLink to='/staff/classhours' exact activeClassName='current'>
							<li>
								<FontAwesomeIcon icon={faBusinessTime} /> Class Hours
							</li>
						</NavLink>
					</ul>
				</li>
			</ul>
		</NavStyles>
	);
}

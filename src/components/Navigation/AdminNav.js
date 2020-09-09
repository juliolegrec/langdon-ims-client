import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
import { NavLink } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavStyles from "../styles/NavStyles";
import styled from "styled-components";

const SubmenuStyled = styled.li`
  list-style: none;
`;

function StaffNav() {
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
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    return <img src={data.schoolInfo.logo} alt='Logo of college' />;
  }

  function schoolName() {
    if (loading) return "Loading...";
    if (error) return "Error!";

    return data.schoolInfo.name;
  }

  return (
    <NavStyles id='react-no-print'>
      <div className='logo-bg'>{schoolLogo()}</div>
      <h3>{schoolName()}</h3>
      <ul className='list-group'>
        <NavLink to='/admin' exact activeClassName='current'>
          <li>\f201 Dashboard</li>
        </NavLink>
        <li className='has-submenu' onClick={toggleAttendanceMenu}>
          Attendance <ExpandMoreIcon />
          <ul className={OpenAttendanceMenu ? "visible" : ""}>
            <NavLink
              to='/admin/student-attendance'
              exact
              activeClassName='current'
            >
              <SubmenuStyled>Student Attendance</SubmenuStyled>
            </NavLink>
            <NavLink
              to='/admin/teacher-attendance'
              exact
              activeClassName='current'
            >
              <SubmenuStyled>Teacher Attendance</SubmenuStyled>
            </NavLink>
          </ul>
        </li>
        <NavLink to='/admin/timetable' exact activeClassName='current'>
          <li>Timetable</li>
        </NavLink>
        <NavLink to='/admin/students' exact activeClassName='current'>
          <li>Student</li>
        </NavLink>
        <NavLink to='/admin/teachers' exact activeClassName='current'>
          <li>Teacher</li>
        </NavLink>
        <li className='has-submenu' onClick={toggleClassMenu}>
          Classes <ExpandMoreIcon />
          <ul className={OpenClassMenu ? "visible" : ""}>
            <NavLink to='/admin/classes' exact activeClassName='current'>
              <SubmenuStyled>Classes</SubmenuStyled>
            </NavLink>
            <NavLink to='/admin/subjects' exact activeClassName='current'>
              <SubmenuStyled>Subjects</SubmenuStyled>
            </NavLink>
          </ul>
        </li>
        <li className='has-submenu' onClick={toggleExamsMenu}>
          Examination <ExpandMoreIcon />
          <ul className={OpenExamsMenu ? "visible" : ""}>
            <NavLink to='/admin/assessments' exact activeClassName='current'>
              <SubmenuStyled>Assessments Schedule</SubmenuStyled>
            </NavLink>
            <NavLink to='/admin/finalexams' exact activeClassName='current'>
              <SubmenuStyled>Final Exams Schedule</SubmenuStyled>
            </NavLink>
          </ul>
        </li>
        <li className='has-submenu' onClick={toggleMarkingsMenu}>
          Markings <ExpandMoreIcon />
          <ul className={OpenMarkingsMenu ? "visible" : ""}>
            <NavLink
              to='/admin/assessment-markings'
              exact
              activeClassName='current'
            >
              <SubmenuStyled>Assessments</SubmenuStyled>
            </NavLink>
            <NavLink to='/admin/exam-markings' exact activeClassName='current'>
              <SubmenuStyled>Exams</SubmenuStyled>
            </NavLink>
          </ul>
        </li>

        <li className='has-submenu' onClick={toggleSettingsMenu}>
          General Settings <ExpandMoreIcon />
          <ul className={OpenSettingsMenu ? "visible" : ""}>
            <NavLink to='/admin/schoolinfo' exact activeClassName='current'>
              <li>School Info</li>
            </NavLink>
            <NavLink to='/admin/schoolcalendar' exact activeClassName='current'>
              <li>School Calendar</li>
            </NavLink>
            <NavLink to='/admin/classhours' exact activeClassName='current'>
              <li>Class Hours</li>
            </NavLink>
          </ul>
        </li>
      </ul>
    </NavStyles>
  );
}

export default StaffNav;

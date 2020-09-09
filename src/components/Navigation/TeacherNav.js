import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../college-logo.svg';
import NavStyles from '../styles/NavStyles';

function StaffNav() {
  return (
    <NavStyles>
      <div className="logo-bg">
        <img src={logo} alt="Logo of college" />
      </div>
      <h3>Langdon College</h3>
      <ul className="list-group">
        <Link to="/dashboard" className="active">
          <li>Dashboard</li>
        </Link>
        <Link to="/students">
          <li>Students</li>
        </Link>
        <Link to="/classes">
          <li>Classes</li>
        </Link>
        <Link to="/timetable">
          <li>Timetable</li>
        </Link>
        <Link to="/attendace">
          <li>Attendance</li>
        </Link>
        <Link to="/settings">
          <li>Settings</li>
        </Link>
      </ul>
    </NavStyles>
  );
}

export default StaffNav;

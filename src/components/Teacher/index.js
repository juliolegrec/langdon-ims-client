import React from 'react';
import Navigation from '../Navigation';
import Header from '../Header';
// import Main from '../Main';
import './Teacher.css';

function Teacher() {
  let state = JSON.parse(localStorage.getItem('state'));
  let { role } = state.sessionState.authUser;

  return (
    <div className="staff-view">
      <Navigation role={role} />
      <aside>
        <Header role={role} />
        <h1>Teacher view</h1>
      </aside>
    </div>
  );
}

export default Teacher;

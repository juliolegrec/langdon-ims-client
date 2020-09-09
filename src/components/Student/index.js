import React from 'react';
import Navigation from '../Navigation';
import Header from '../Header';
// import Main from '../Main';
import './Student.css';

function Staff() {
	return (
		<div className="staff-view">
			<Navigation />
			<aside>
				<Header />
				<h1>Student view</h1>
			</aside>
		</div>
	);
}

export default Staff;

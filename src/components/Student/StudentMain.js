import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainNotFound from '../MainNotFound';
import Dashboard from './Mains/Dashboard';
import StudentProfile from './Mains/StudentProfile';
import Timetable from './Mains/Timetable';

import styled from 'styled-components';

const MainStyled = styled.div`
	width: 100%;
	height: calc(100vh - 50px);
	overflow: scroll;
	background: #f5f5f5;

	@media print {
		overflow: initial !important;
	}
`;

export default function StudentMain(props) {
	return (
		<MainStyled>
			<Switch>
				<Route exact path="/student/" component={Dashboard} />
				<Route
					exact
					path="/student/student-profile"
					component={StudentProfile}
				/>
				<Route exact path="/student/timetable" component={Timetable} />
				<Route path="*" component={MainNotFound} />
			</Switch>
		</MainStyled>
	);
}

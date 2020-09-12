import React from 'react';
import Navigation from '../Navigation';
import Header from '../Header';
import StudentMain from './StudentMain';
import styled from 'styled-components';
import './styles/Student.css';

const FullViewStyled = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
`;

const StyledAside = styled.aside`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px 1fr;
`;

export default function Student() {
	let state = JSON.parse(localStorage.getItem('state'));
	let { role } = state.sessionState.authUser;
	return (
		<FullViewStyled>
			<Navigation role={role} />
			<StyledAside>
				<Header />
				<StudentMain role={role} />
			</StyledAside>
		</FullViewStyled>
	);
}

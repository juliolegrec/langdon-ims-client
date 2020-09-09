import React from 'react';
import Navigation from '../Navigation';
import Header from '../Header';
import StaffMain from './StaffMain';
import styled from 'styled-components';
import './styles/Staff.css';

const FullViewStyled = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
`;

const StyledAside = styled.aside`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px 1fr;
`;

export default function Staff() {
	let state = JSON.parse(localStorage.getItem('state'));
	let { role } = state.sessionState.authUser;

	return (
		<FullViewStyled>
			<Navigation role={role} />
			<StyledAside>
				<Header role={role} />
				<StaffMain role={role} />
			</StyledAside>
		</FullViewStyled>
	);
}

import React from 'react';
import styled from 'styled-components';
import notFoundSvg from '../../../404.svg';

const NotFoundStyle = styled.div`
	width: calc(100vw - 250px);
	height: 100vh;
	/* background-color: #00194f; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* color: white; */

	img {
		width: 40%;
	}

	a {
		text-transform: uppercase;
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: bold;
		color: beige;
	}
`;

function NotFound() {
	return (
		<NotFoundStyle>
			<img src={notFoundSvg} alt="" />
			<h1>Oops, page does not exist</h1>
		</NotFoundStyle>
	);
}

export default NotFound;

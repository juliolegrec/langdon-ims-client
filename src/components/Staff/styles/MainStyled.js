import styled from 'styled-components';

const StyledMain = styled.main`
	max-width: 60%;
	/* height: 100%; */
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;
	position: relative;

	h2 {
		margin-bottom: 10px;
		grid-column-start: 1;
		grid-column-end: 3;
	}

	@media only screen and (max-width: 1500px) {
		max-width: 95%;
	}
`;

export default StyledMain;

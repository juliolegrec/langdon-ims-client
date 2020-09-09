import styled from 'styled-components';

const StyledHeader = styled.header`
	background-color: #2bb2ff;
	height: 50px;
	padding: 0 20px;
	display: grid;
	grid-template-columns: 1fr auto;
	color: #2c3e50;

	h1 {
		margin-top: 9px;
	}

	.user-data {
		text-align: right;
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: auto auto;
		grid-template-rows: 25px 25px;

		.avatar {
			grid-row: 1/3;
			margin: 5px 10px 0 0;
			width: 40px;
			height: 40px;
			object-fit: cover;
			border-radius: 2px;
		}
		.logout-btn {
			height: 25px;
			grid-row: 1/3;
			cursor: pointer;
			text-transform: uppercase;
			background-color: gold;
			font-weight: bold;
			border-radius: 2px;
			border: none;
			margin: 10px;
			margin-right: 0;
		}
		#user-name {
			font-size: 1.25rem;
			line-height: 1;
			margin-top: 5px;
			font-weight: 700;
		}
		#user-role {
			text-transform: capitalize;
		}
	}
`;

export default StyledHeader;

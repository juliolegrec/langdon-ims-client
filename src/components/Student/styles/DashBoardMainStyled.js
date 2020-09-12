import styled from 'styled-components';

const DashboardMainStyled = styled.main`
	max-width: 80%;
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;
	display: grid;
	grid-gap: 10px;
	grid-template-columns: repeat(2, auto);
	grid-template-rows: repeat(3, auto);

	h2 {
		margin-bottom: 10px;
		grid-column-start: 1;
		grid-column-end: 3;
	}

	.stats {
		width: 100%;
		grid-column-start: 1;
		grid-column-end: 3;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 10px;
		margin-bottom: 20px;

		.stats-box {
			height: 100%;
			text-align: center;
			padding: 20px 10px;
			align-self: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: #2c3e50;
			border-radius: 2px;
			cursor: pointer;
			transition: transform 0.5s;

			&:hover {
				/* color: red; */
				transform: scale(1.1);
			}

			&:nth-child(1) {
				background: #fbc531;
			}
			&:nth-child(2) {
				background: #2ecc71;
			}
			&:nth-child(3) {
				background: #3498d8;
			}
			&:nth-child(4) {
				background: #e74c3c;
			}

			h3 {
				font-size: 4rem;
				line-height: 1;
			}
			.sub-text {
				font-size: 1em;
			}
		}
	}

	.calendar {
		grid-row-start: 3;
		grid-row-end: 5;
	}

	.academic-calendar,
	.exams-calendar {
		border: 1px solid #a0a096;

		h3 {
			width: 100%;
			margin-bottom: 10px;
			padding: 10px 15px;
			background: #ccc;
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 0;

			li {
				padding: 10px 15px;
			}
		}
	}
`;

export default DashboardMainStyled;

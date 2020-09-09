import styled from 'styled-components';

const TeacherRegistrationStyled = styled.div`
	max-width: 800px;
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;

	h2 {
		margin-bottom: 10px;
	}

	form {
		max-width: 100%;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 10px;
		border: 1px solid #cccccc;
		border-radius: 3px;
		padding: 15px;

		label {
			/* margin-bottom: 15px; */

			input {
				width: 100%;
				height: 30px;
				margin-top: 15px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;
			}

			select {
				width: 100%;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;
			}

			.tip {
				font-size: 0.75rem;
			}
		}
	}
	.form-buttons {
		align-self: center;
		display: flex;
		justify-content: space-around;

		button {
			height: 40px;
			padding: 10px 15px;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;

			&:nth-child(2) {
				background-color: #e74c3c;
			}
			&:nth-child(3) {
				background-color: transparent;
				color: #2980b9;
				font-size: 0.75rem;
			}
		}
	}
`;

export default TeacherRegistrationStyled;

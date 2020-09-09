import styled from 'styled-components';

const TeacherViewStyled = styled.div`
	margin: 35px auto 25px;
	max-width: 1000px;
	background-color: white;
	padding: 30px 20px 10px;
	display: grid;
	grid-template-columns: 60% 40%;
	grid-template-rows: 50px auto;
	grid-gap: 10px;
	border-radius: 2px;
	position: relative;

	form {
		display: flex;
		flex-direction: column;

		label {
			font-weight: 700;
			margin-bottom: 3px;
		}
		input {
			font-family: 'Source Sans Pro', sans-serif;
			font-size: 1rem;
			border: none;
			margin-left: 10px;
			color: #2c3e50;
			width: 50%;
			background-color: #e5e5e5;
			box-sizing: border-box;

			&:disabled {
				text-decoration: none;
				background-color: #ffffff;
			}
		}
	}

	.go-back-btn {
		position: absolute;
		top: 8px;
		left: 20px;
		border: none;
		text-align: left;
		cursor: pointer;
		color: #1976d2;
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 1rem;
	}

	.teacher-header {
		grid-column-start: 1;
		grid-column-end: 3;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.teacher-name {
			font-size: 1.5rem;
			color: #e74c3c;
			font-weight: normal;
		}
	}

	section {
		margin-bottom: 20px;
	}

	h2 {
		margin-bottom: 10px;
	}

	.personal-details {
		display: grid;
		grid-template-columns: 150px 1fr;
		grid-gap: 10px;
		align-content: center;

		#student-pic {
			border: 1px solid transparent;
			border-radius: 5px;
			width: 150px;
		}
	}

	.controlButtons {
		display: inline-block;
	}

	.saveBtn,
	.editBtn,
	.cancelBtn {
		margin-left: 10px;
		font-weight: bold;
		font-size: 0.85rem;
		color: #7f8c8d;
		cursor: pointer;
		text-transform: uppercase;
	}

	.saveBtn {
		color: #27ae60;
	}

	.cancelBtn {
		color: #e74c3c;
	}
`;

export default TeacherViewStyled;

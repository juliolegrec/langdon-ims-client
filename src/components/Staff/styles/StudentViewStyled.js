import styled from 'styled-components';

const StudentViewStyled = styled.div`
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

	.student-header {
		grid-column-start: 1;
		grid-column-end: 3;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.student-name {
			font-size: 1.5rem;
			color: #e74c3c;
			font-weight: normal;
			margin-top: 10px;

			#sFirstName,
			#sLastName {
				display: inline;
				position: relative;
			}

			#sLastName {
				text-transform: uppercase;
			}

			#sFirstName > label,
			#sLastName > label {
				font-size: 0.55em;
				position: absolute;
				top: -15px;
				color: #2c3e50;
				text-transform: none;
			}
		}
	}

	.editable {
		border: 1px solid transparent;
		background: #e5e5e5;
		margin: 5px 5px 0 0;
		font-size: inherit;
		color: inherit;
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

		#pic-update {
			width: 150px;

			& > label {
				width: 100%;
				position: relative;
				overflow: hidden;
				display: inline-block;

				& > button {
					border: 2px solid gray;
					color: gray;
					background-color: white;
					padding: 8px 20px;
					border-radius: 8px;
					font-size: 20px;
					font-weight: bold;
				}

				& > input[type='file'] {
					/* font-size: 100px; */
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
					opacity: 0;
					cursor: pointer;
				}
			}
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

export default StudentViewStyled;

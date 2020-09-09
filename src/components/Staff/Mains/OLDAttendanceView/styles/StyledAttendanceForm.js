import styled from 'styled-components';

const StyledAttendanceForm = styled.div`
	box-sizing: border-box;
	width: 100%;
	background: #f5f5f5;
	padding: 10px;

	form {
		background: #fff;
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-gap: 10px;

		label {
			width: 100%;

			input,
			select {
				display: inline-block;
				width: 100%;
				/* margin-top: 10px; */
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;
			}
		}

		#btn-group > button,
		button {
			width: auto;
			height: 35px;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #3498db;
			border-radius: 3px;
			color: white;
			cursor: pointer;
			align-self: end;
			text-transform: uppercase;
		}
		#btn-group {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-gap: 10px;

			& > #save-btn {
				background-color: #2ecc71;
				display: flex;
				align-items: center;
				justify-content: space-evenly;

				& > #saving-spinner {
					display: inline-block;
					width: 30px;
					height: 30px;
				}
			}

			& > #cancel-btn {
				background-color: #e74c3c;
			}
		}
	}
`;

export default StyledAttendanceForm;

import styled from 'styled-components';

const StyledNewClassMain = styled.main`
	max-width: 800px;
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;

	h2 {
		margin-bottom: 10px;

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
	}

	form {
		max-width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 10px;

		fieldset {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		label {
			margin: 5px 0;
			&.hide {
				display: none;
			}

			input,
			select {
				margin-top: 10px;
				width: 100%;
				height: 35px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;

				&.hide {
					display: none;
				}

				&:disabled {
					color: inherit;
					background-color: #dedede;
					border: 1px solid transparent;
					opacity: 1;
				}
			}

			input[type='checkbox'] {
				width: auto;
				height: auto;
				margin: 0 5px;
			}
		}

		button {
			width: 100px;
			margin: 10px 15px 15px 0;
			grid-column-start: 1;
			grid-column-end: 3;
			padding: 10px 15px;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;

			&:nth-child(2) {
				background: #2c3e50;
			}
		}
	}
`;
export default StyledNewClassMain;

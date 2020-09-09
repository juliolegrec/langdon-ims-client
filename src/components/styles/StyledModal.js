import styled from 'styled-components';

const StyledModal = styled.div`
	width: 30%;
	background: #ffffff;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-25%, -50%);

	h3 {
		margin-top: 15px;
		text-align: center;
	}

	.btn {
		width: 100%;
		margin: 30px 0;
		display: flex;
		justify-content: center;

		button {
			margin: 0 15px;
			width: 150px;
			height: 40px;
			background-color: #2ecc71;
			color: white;
			font-weight: bold;
			font-size: 1rem;
			cursor: pointer;
			border: 1px solid transparent;
			border-radius: 0.25rem;

			&:nth-child(1) {
				background-color: #e74c3c;
			}
		}
	}
`;

export default StyledModal;

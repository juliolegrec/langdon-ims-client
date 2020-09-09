import styled from 'styled-components';

const ActionBtnStyled = styled.td`
	button {
		margin: 0 5px;
		color: white;
		font-weight: Bold;
		/* font-size: 1rem; */
		border-radius: 3px;
		border: 1px solid transparent;

		&:nth-child(1) {
			background: #f39c12;
		}
		&:nth-child(2) {
			background: #e74c3c;
		}
	}
`;

export default ActionBtnStyled;

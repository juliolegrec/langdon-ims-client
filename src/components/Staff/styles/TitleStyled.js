import styled from 'styled-components';

const TitleStyled = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	position: absolute;
	right: 0;
	top: -25px;

	button {
		background: #3498db;
		border: 1px solid transparent;
		color: white;
		font-weight: bold;
		border-radius: 3px;
		cursor: pointer;
		margin-left: 10px;
		height: 20px;
	}
`;

export default TitleStyled;

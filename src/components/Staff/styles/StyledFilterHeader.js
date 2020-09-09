import styled from 'styled-components';

const StyledFilterHeader = styled.div`
	height: 50px;
	width: 100%;
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	/* grid-template-columns: repeat(3, min-content);
	align-items: center;
	grid-gap: 10px; */
	label {
		font-size: 1rem;
	}

	input {
		height: 75%;
		/* width: 50%; */
		margin: 0 10px;
		border: 1px solid #ddd;
		border-radius: 0.25rem;
		padding-left: 10px;
		font-size: 1.25rem;
		flex-grow: 3;
	}

	select {
		height: 75%;
		border: 1px solid #ddd;
		border-radius: 0.25rem;
		padding-left: 10px;
		font-size: 1.15rem;
		flex-grow: 2;
	}

	button {
		width: 150px;
		height: 75%;
		background-color: #0068d9;
		color: white;
		font-weight: bold;
		font-size: 1rem;
		cursor: pointer;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		flex-grow: 1;
	}
`;

export default StyledFilterHeader;

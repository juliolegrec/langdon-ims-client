import styled from 'styled-components';

const StyledTable = styled.table`
	border-collapse: collapse;
	text-align: center;
	width: 100%;
	position: relative;

	th,
	td {
		border: 1px solid #ddd;
		padding: 5px;
	}

	thead {
		background-color: violet;
	}

	th {
		position: sticky;
		top: 0;
		background-color: violet;
	}

	tbody a {
		text-decoration: none;
		display: block;
	}

	tbody tr:hover {
		background-color: plum;
		cursor: pointer;
	}
`;

export default StyledTable;

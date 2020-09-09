import styled from 'styled-components';

const StyledTable = styled.div`
	text-align: center;
	width: 100%;
	background: #f5f5f5;
	border-radius: 2px;
	padding: 10px;
	margin-top: 25px;

	table {
		width: 100%;
		border: 3px solid #f5f5f5;
		background: #ffffff;
		border-collapse: collapse;

		thead,
		tbody {
			text-align: center;
		}

		thead {
			font-weight: bold;
			text-transform: uppercase;
		}

		tr {
			height: 40px;
		}

		tbody > tr:hover {
			background: #d5d5d5;
			cursor: pointer;
		}

		td {
			border: 3px solid #f5f5f5;
		}

		#delete-icon {
			color: #e74c3c;
			margin-left: 10px;
		}
	}
`;

export default StyledTable;

import styled from 'styled-components';

const DataTableStyled = styled.div`
	width: 100%;

	table {
		width: 100%;
		border: 1px solid #bdc3c7;
		border-collapse: collapse;

		thead {
			font-weight: bold;
			text-align: center;
			background: #34495e;
			color: #ecf0f1;

			tr {
				height: 35px;

				th {
					border: 1px solid #bdc3c7;
				}
			}
		}

		tbody {
			text-align: center;

			tr {
				height: 35px;
				cursor: pointer;

				&:nth-child(even) {
					background: #ecf0f1;
				}

				td {
					border: 1px solid #bdc3c7;
				}

				&:hover {
					background: #95a5a6;
				}
			}
		}

		@media print {
			table {
				/* overflow: visible !important;
				display: block !important; */
				max-height: 100%;
				overflow: hidden;
				page-break-after: always;
			}
			th {
				border: 1px solid #bdc3c7;
				color: black;
			}
		}
	}
`;

export default DataTableStyled;

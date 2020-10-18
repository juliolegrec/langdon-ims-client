import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import DataTableStyled from '../styles/DataTableStyled';
import moment from 'moment';

const SchoolCalendarMainStyled = styled.main`
	max-width: 800px;
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;

	h2 {
		margin-bottom: 10px;
	}

	form {
		max-width: 100%;
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-gap: 10px;

		label {
			/* margin-bottom: 30px; */

			input,
			select {
				width: 100%;
				height: 30px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				margin-top: 10px;
				padding-left: 10px;
			}
		}

		button {
			width: 125px;
			height: 35px;
			grid-column-start: 1;
			grid-column-end: 3;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;
		}
	}
	.term-table {
		margin-top: 30px;

		.MuiSvgIcon-root {
			cursor: pointer;
		}
	}
`;

function SchoolCalendar() {
	const [schoolTerm, setSchoolTerm] = useState({});

	const CREATE_SCHOOL_TERM = gql`
		mutation {
			createSchoolTerm(
				schoolTermInput: {
					termName: "${schoolTerm.termName}"
					beginDate: "${schoolTerm.beginDate}"
					endDate: "${schoolTerm.endDate}"
				}
			) {
				_id
			}
		}
	`;

	const [createSchoolTerm] = useMutation(CREATE_SCHOOL_TERM);

	const GET_ALL_SCHOOLTERMS = gql`
		{
			allSchoolTerms {
				_id
				termName
				beginDate
				endDate
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_SCHOOLTERMS);

	function displaySchoolTerms() {
		if (loading)
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);
		if (error)
			return (
				<tr>
					<td>{error.message}</td>
				</tr>
			);

		console.log(data);

		const allSchoolTerms = data.allSchoolTerms;

		return allSchoolTerms.map((schoolTerm) => {
			return (
				<tr hover={true} id={schoolTerm._id} key={schoolTerm._id}>
					<td>{schoolTerm.termName}</td>
					{/* <td>{schoolTerm.beginDate}</td> */}
					<td>{moment(schoolTerm.beginDate).format('Do MMMM YYYY')}</td>
					<td>{moment(schoolTerm.endDate).format('Do MMMM YYYY')}</td>
					<td>
						<DeleteIcon
							onClick={(e) => {
								deleteSchoolTerm({
									variables: {
										_id: e.target.parentNode.parentNode.parentNode.getAttribute(
											'id'
										),
									},
								});
								window.location.reload();
							}}
						/>
					</td>
				</tr>
			);
		});
	}

	const DELETE_SCHOOL_TERM = gql`
		mutation DeleteSchoolTerm($_id: ID!) {
			deleteSchoolTerm(_id: $_id) {
				termName
			}
		}
	`;

	const [deleteSchoolTerm] = useMutation(DELETE_SCHOOL_TERM);

	return (
		<SchoolCalendarMainStyled>
			<h2>School Calendar</h2>
			<section>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createSchoolTerm();
						window.location.reload();
					}}
				>
					<label>
						Term Name:
						<input
							type="text"
							value={schoolTerm.termName || ''}
							onChange={(e) =>
								setSchoolTerm({ ...schoolTerm, termName: e.target.value })
							}
						/>
					</label>
					<label>
						From:
						<input
							type="date"
							value={schoolTerm.beginDate || ''}
							onChange={(e) =>
								setSchoolTerm({ ...schoolTerm, beginDate: e.target.value })
							}
						/>
					</label>
					<label>
						To:
						<input
							type="date"
							value={schoolTerm.endDate || ''}
							onChange={(e) =>
								setSchoolTerm({ ...schoolTerm, endDate: e.target.value })
							}
						/>
					</label>
					<button type="submit">+ Add Term</button>
				</form>
			</section>
			<section className="term-table">
				<DataTableStyled>
					<table>
						<thead>
							<tr>
								<th>Term Name</th>
								<th>Begin Date</th>
								<th>End Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>{displaySchoolTerms()}</tbody>
					</table>
				</DataTableStyled>
			</section>
		</SchoolCalendarMainStyled>
	);
}

export default SchoolCalendar;

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';

import StyledMain from '../styles/MainStyled';
import DataTableStyled from '../styles/DataTableStyled';

const FormStyled = styled.section`
	form {
		max-width: 100%;
		display: grid;
		grid-template-columns: repeat(4, auto);
		grid-gap: 10px;

		label {

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
		.MuiSvgIcon-root {
			cursor: pointer;
		}
	}
`;

function ClassHours() {
	const [classHour, setClassHour] = useState({ type: 'TEACHING' });

	const CREATE_CLASS_HOUR = gql`
		mutation {
			createClassHour(
				classHourInput: {
					hourName: "${classHour.hourName}"
					beginTime: "${classHour.beginTime}"
					endTime: "${classHour.endTime}"
					type: ${classHour.type}
				}
			) {
				_id
				hourName
			}
		}
	`;

	const [createClassHour] = useMutation(CREATE_CLASS_HOUR);

	console.log(classHour);

	const GET_ALL_CLASSHOURS = gql`
		{
			allClassHours {
				_id
				hourName
				beginTime
				endTime
				type
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_CLASSHOURS);
	// if (loading) return <p>Loading...</p>;
	// if (error) return <p>{error.message}</p>;

	// console.log(data.allClassHours);

	function displayClassHours() {
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

		const allClassHours = data.allClassHours;

		return allClassHours.map((classHour) => {
			return (
				<tr hover={true} id={classHour._id} key={classHour._id}>
					<td>{classHour.hourName}</td>
					<td>{classHour.beginTime}</td>
					<td>{classHour.endTime}</td>
					<td>{classHour.type}</td>
					<td>
						<DeleteIcon
							onClick={(e) => {
								deleteClassHour({
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

	const DELETE_CLASS_HOUR = gql`
		mutation DeleteClassHour($_id: ID!) {
			deleteClassHour(_id: $_id) {
				hourName
			}
		}
	`;

	const [deleteClassHour] = useMutation(DELETE_CLASS_HOUR);

	return (
		<StyledMain>
			<h2>Class Hours</h2>
			<FormStyled>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createClassHour();
						window.location.reload();
					}}
				>
					<label>
						Class Name:
						<input
							type="text"
							value={classHour.hourName || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, hourName: e.target.value })
							}
						/>
					</label>
					<label>
						From:
						<input
							type="time"
							value={classHour.beginTime || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, beginTime: e.target.value })
							}
						/>
					</label>
					<label>
						To:
						<input
							type="time"
							value={classHour.endTime || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, endTime: e.target.value })
							}
						/>
					</label>
					<label>
						Type:
						<select
							value={classHour.type || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, type: e.target.value })
							}
						>
							<option value="TEACHING">Teaching</option>
							<option value="BREAK">Break</option>
						</select>
					</label>
					<button type="submit">+ Add Hour</button>
				</form>
			</FormStyled>

			<DataTableStyled style={{ marginTop: '20px' }}>
				<table>
					<thead>
						<tr>
							<th>Class Name</th>
							<th>Begin Time</th>
							<th>End Time</th>
							<th>Type</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>{displayClassHours()}</tbody>
				</table>
			</DataTableStyled>
		</StyledMain>
	);
}

export default ClassHours;

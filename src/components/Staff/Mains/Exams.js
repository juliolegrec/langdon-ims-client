import React from 'react';
import StyledMain from '../styles/MainStyled';
import StyledTable from '../styles/StyledTable';

export default function Exams() {
	return (
		<StyledMain>
			<h2>Exams List</h2>
			<StyledTable>
				<table>
					<thead>
						<tr>
							<th>Class Name</th>
							<th>Subject Name</th>
							<th>Paper Code</th>
							<th>Exam Date</th>
							<th>Exam Start Time</th>
							<th>Duration</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>11 RED</td>
							<td>Maths</td>
							<td>1</td>
							<td>27/04/2020</td>
							<td>08:00</td>
							<td>2 hours</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</StyledTable>
		</StyledMain>
	);
}

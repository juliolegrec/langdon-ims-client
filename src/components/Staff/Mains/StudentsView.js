import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../styles/MainStyled';
import StyledFilterHeader from '../styles/StyledFilterHeader';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import TitleStyled from '../styles/TitleStyled';
import DataTableStyled from '../styles/DataTableStyled';

const GET_ALL_STUDENTS = gql`
	{
		allStudents {
			_id
			studentID
			firstName
			lastName
			classDetails {
				_id
				className
				grade
			}
			telephoneNumber
		}
	}
`;

export default function StudentsView(props) {
	const [search, setSearch] = useState('');
	const [searchTerm, setSearchTerm] = useState('lastname');

	const { loading, error, data } = useQuery(GET_ALL_STUDENTS);

	const pageTitle = 'Students List';

	function goToStudentPage(e) {
		const id = e.target.parentNode.getAttribute('id');
		props.history.push(`/staff/student/${id}`);
	}

	function displayStudents() {
		if (loading)
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);
		if (error)
			return (
				<tr>
					<td>Error....</td>
				</tr>
			);
		const students = data.allStudents;
		let filteredStudents;

		switch (searchTerm) {
			case 'lastname':
				filteredStudents = students.filter((student) => {
					let lastName = student.lastName.toLowerCase();
					return lastName.indexOf(search) !== -1;
				});
				break;
			case 'studentid':
				filteredStudents = students.filter((student) => {
					let studentID = student.studentID;
					return studentID.indexOf(search) !== -1;
				});
				break;
			default:
				break;
		}

		return filteredStudents
			.sort((a, b) =>
				parseInt(a.classDetails.grade) > parseInt(b.classDetails.grade)
					? 1
					: parseInt(b.classDetails.grade) > parseInt(a.classDetails.grade)
					? -1
					: 0
			)
			.map((student) => {
				return (
					<tr id={student._id} key={student._id} onClick={goToStudentPage}>
						<td>{student.studentID}</td>
						<td>{student.firstName}</td>
						<td>{student.lastName}</td>
						<td>
							{student && student.classDetails
								? student.classDetails.grade
								: ''}
						</td>
						<td>
							{student && student.classDetails
								? student.classDetails.className
								: ''}
						</td>
						<td>{student.telephoneNumber}</td>
					</tr>
				);
			});
	}

	function displayTable() {
		return (
			<DataTableStyled style={{ marginTop: '5mm' }}>
				<table>
					<thead>
						<tr>
							<th>Student ID</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Grade</th>
							<th>Class Name</th>
							<th>Telephone Number</th>
						</tr>
					</thead>
					<tbody>{displayStudents()}</tbody>
				</table>
			</DataTableStyled>
		);
	}

	function registerNewStudent() {
		props.history.push(`/staff/students/register-student`);
	}

	return (
		<div>
			<StyledMain id='react-no-print'>
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				<StyledFilterHeader>
					<label>
						Search by:
						<select
							onChange={(e) => {
								setSearchTerm(e.target.value);
							}}
						>
							<option value='lastname'>Last Name</option>
							<option value='studentid'>Student ID</option>
						</select>
					</label>
					<input
						type='text'
						placeholder='Search...'
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button onClick={() => registerNewStudent()}>+ Add Student</button>
				</StyledFilterHeader>
				{displayTable()}
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				{displayTable()}
			</PrintTemplate>
		</div>
	);
}

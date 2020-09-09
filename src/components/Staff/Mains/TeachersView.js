import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../styles/MainStyled';
import StyledFilterHeader from '../styles/StyledFilterHeader';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import TitleStyled from '../styles/TitleStyled';
import DataTableStyled from '../styles/DataTableStyled';

const GET_ALL_TEACHERS = gql`
	{
		allTeachers {
			_id
			teacherID
			firstName
			lastName
			telephoneNumber
			emailAddress
			subjectTaught {
				_id
				subjectName
			}
			classAssigned {
				_id
				classID
				grade
				className
			}
		}
	}
`;

function TeachersView(props) {
	const [search, setSearch] = useState('');
	const [searchTerm, setSearchTerm] = useState('lastname');

	const pageTitle = 'Teachers List';

	const { loading, error, data } = useQuery(GET_ALL_TEACHERS);

	function goToTeacherPage(e) {
		const id = e.target.parentNode.getAttribute('id');
		props.history.push(`/staff/teacher/${id}`);
	}

	function displayTeachers() {
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
		const teachers = data.allTeachers;
		let filteredTeachers;

		switch (searchTerm) {
			case 'lastname':
				filteredTeachers = teachers.filter((teacher) => {
					let lastName = teacher.lastName.toLowerCase();
					return lastName.indexOf(search) !== -1;
				});
				break;
			case 'teacherid':
				filteredTeachers = teachers.filter((teacher) => {
					let teacherID = teacher.teacherID;
					return teacherID.indexOf(search) !== -1;
				});
				break;
			default:
				break;
		}

		return filteredTeachers.map((teacher) => {
			return (
				<tr id={teacher._id} key={teacher._id} onClick={goToTeacherPage}>
					<td>{teacher.teacherID}</td>
					<td>{teacher.firstName}</td>
					<td>{teacher.lastName}</td>
					<td>{teacher.telephoneNumber}</td>
					<td>{teacher.emailAddress}</td>
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
							<th>Teacher ID</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Telephone Number</th>
							<th>Email Address</th>
						</tr>
					</thead>
					<tbody>{displayTeachers()}</tbody>
				</table>
			</DataTableStyled>
		);
	}

	function registerNewTeacher() {
		props.history.push(`/staff/teachers/register-teacher`);
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
							<option value='teacherid'>Teacher ID</option>
						</select>
					</label>
					<input
						type='text'
						placeholder='Search...'
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button onClick={() => registerNewTeacher()}>+ Add Teacher</button>
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

export default TeachersView;

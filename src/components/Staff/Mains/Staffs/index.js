import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import StyledFilterHeader from '../../styles/StyledFilterHeader';
import DataTableStyled from '../../styles/DataTableStyled';

const GET_ALL_STAFFS = gql`
	{
		allStaffs {
			_id
			staffID
			firstName
			lastName
			profilePic
			telephoneNumber
			emailAddress
		}
	}
`;

export default function StaffsView(props) {
	const [search, setSearch] = useState('');
	const [searchTerm, setSearchTerm] = useState('lastname');

	const { loading, error, data } = useQuery(GET_ALL_STAFFS);

	const pageTitle = 'Staffs List';

	function goToStaffPage(e) {
		const id = e.target.parentNode.getAttribute('id');
		props.history.push(`/staff/admin/staffs/${id}`);
	}

	function displayStaffs() {
		if (loading) {
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);
		}
		if (error) {
			return (
				<tr>
					<td>Error!</td>
				</tr>
			);
		}
		const staffs = data.allStaffs;
		let filteredStaffs;

		switch (searchTerm) {
			case 'lastname':
				filteredStaffs = staffs.filter((staff) => {
					let lastName = staff.lastName.toLowerCase();
					return lastName.indexOf(search) !== -1;
				});
				break;
			case 'staffid':
				filteredStaffs = staffs.filter((staff) => {
					let staffID = staff.staffID;
					return staffID.indexOf(search) !== -1;
				});
				break;
			default:
				break;
		}

		return filteredStaffs.map((staff) => {
			return (
				<tr id={staff._id} key={staff._id} onClick={goToStaffPage}>
					<td>{staff.staffID}</td>
					<td>{staff.firstName}</td>
					<td>{staff.lastName}</td>
					<td>{staff.telephoneNumber}</td>
					<td>{staff.emailAddress}</td>
				</tr>
			);
		});
	}

	function registerNewStaff() {
		props.history.push(`/staff/admin/staff/register-staff`);
	}

	return (
		<StyledMain>
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
						<option value='studentid'>Staff ID</option>
					</select>
				</label>
				<input
					type='text'
					placeholder='Search...'
					onChange={(e) => setSearch(e.target.value)}
				/>
				<button onClick={() => registerNewStaff()}>+ Add Staff</button>
			</StyledFilterHeader>
			<DataTableStyled>
				<table>
					<thead>
						<tr>
							<th>Staff ID</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Telephone No.</th>
							<th>Email Address</th>
						</tr>
					</thead>
					<tbody>{displayStaffs()}</tbody>
				</table>
			</DataTableStyled>
		</StyledMain>
	);
}

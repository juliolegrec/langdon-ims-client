import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import PersonalDetails from './PersonalDetails';
import GuardianDetails from './GuardianDetails';
import SchoolClassDetails from './SchoolClassDetails';
import PersonViewStyled from '../../styles/PersonViewStyled';
import { capitalize } from '../../../../helpers';
import moment from 'moment';
import PrintTemplate from 'react-print';
import PrintHeader from '../../../PrintHeader';
import styled from 'styled-components';
import TitleStyled from '../../styles/TitleStyled';

const SmallDataTable = styled.div`
	table {
		border-collapse: collapse;
		border: 1px solid grey;

		tr {
			border: 1px solid grey;

			th,
			td {
				border: 1px solid grey;
				padding: 5px 15px;
			}
		}
	}
`;

export default function StudentView(props) {
	const studentMongoId = props.match.params.id;
	const SELECTED_STUDENT_INFO = gql`
	{
		studentFromId(_id: "${studentMongoId}")	{
			studentID
			firstName
			lastName
			gender
			dob
			streetAddress
			city
			zipCode
			classID
			telephoneNumber
			emailAddress
			profilePic
			classDetails {
				_id
				className
				grade
				classID
			}
			guardianDetails {
				_id
				firstName
				lastName
				relationship
				mobilePhone
				workPhone
				emailAddress
			}
			enrollmentDate
		}
	}
	`;

	const { loading, error, data } = useQuery(SELECTED_STUDENT_INFO);

	const [editable, setEditable] = useState(false);
	const [studentID, setStudentID] = useState('');
	const [studentName, setStudentName] = useState({});

	const pageTitle = 'Student Information';

	useEffect(() => {
		setStudentName({
			firstName: data && data.studentFromId.firstName,
			lastName: data && data.studentFromId.lastName,
		});
		setStudentID(data && data.studentFromId.studentID);
	}, [data]);

	const today = moment().format('YYYY-MM-DD');

	const GET_ATTENDANCE_PREVIOUS = gql`
		{
			studentAttendance5days(date: "${today}", studentID: "${studentID}") {
				dateOfAttendance
				attendance {
					studentID
					status
				}
			}
		}
	`;

	const {
		loading: loadingPrevAttendance,
		error: errorPrevAttendance,
		data: dataPrevAttendance,
	} = useQuery(GET_ATTENDANCE_PREVIOUS);

	const UPDATE_STUDENT_NAME = gql`
		mutation {
			updateStudentPersoInfo(
				_id: "${studentMongoId}"
				firstName: "${capitalize(studentName.firstName)}"
				lastName: "${studentName.lastName}"
			) {
				_id
			}
		}
	`;

	const [updateNameInfo] = useMutation(UPDATE_STUDENT_NAME);

	if (loading) return <h1>Loading...</h1>;
	if (error) return <h1>` Error! ${error.message}`</h1>;

	function SaveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	function displayLastAttendance() {
		if (loadingPrevAttendance)
			return (
				<tr colSpan='2'>
					<td>Loading...</td>
				</tr>
			);
		if (errorPrevAttendance)
			return (
				<tr colSpan='2'>
					<td>`Error! ${error.message}`</td>
				</tr>
			);

		const data = dataPrevAttendance.studentAttendance5days;

		return data.map((element) => {
			// if (element && element.attendance) {
			return (
				<tr key={element.dateOfAttendance}>
					<td>{moment(element.dateOfAttendance).format('ddd, DD/MM/YY')}</td>
					<td>
						{element.attendance.status === null ||
						element.attendance.status === 'NOT RECORDED' ? (
							<span style={{ fontWeight: 'bold', color: '#3498db' }}>
								NOT RECORDED
							</span>
						) : element.attendance.status === 'ABSENT' ? (
							<span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
								{element.attendance.status}
							</span>
						) : (
							<span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
								{element.attendance.status}
							</span>
						)}
					</td>
				</tr>
			);
			// }
		});
	}

	function displayStudentCompleteInfo() {
		return (
			<PersonViewStyled>
				<TitleStyled id='react-no-print'>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<button
					id='react-no-print'
					className='go-back-btn'
					onClick={() => {
						props.history.push('/staff/students');
					}}
				>
					&lt; Back
				</button>
				<div className='person-header'>
					<h1 className='person-name'>
						{!editable ? (
							<span id='firstName'>{studentName.firstName} </span>
						) : (
							<div id='firstName'>
								<label>First Name:</label>
								<input
									data-content='First Name'
									className={editable ? 'editable' : ''}
									type='text'
									value={studentName.firstName}
									onChange={(e) => {
										setStudentName({
											...studentName,
											firstName: capitalize(e.target.value),
										});
									}}
								/>
							</div>
						)}
						{!editable ? (
							<span id='lastName'>{studentName.lastName} </span>
						) : (
							<div id='lastName'>
								<label>Last Name:</label>
								<input
									data-content='Last Name'
									className={editable ? 'editable' : ''}
									type='text'
									value={studentName.lastName}
									onChange={(e) => {
										setStudentName({
											...studentName,
											lastName: capitalize(e.target.value),
										});
									}}
								/>
							</div>
						)}
						<span id='studentID'>&#40;{data.studentFromId.studentID}&#41;</span>
						{editable ? (
							<>
								<span
									id='react-no-print'
									className='saveBtn'
									onClick={(e) => {
										updateNameInfo();
										SaveToDB();
									}}
								>
									save
								</span>
								<span
									id='react-no-print'
									className='cancelBtn'
									onClick={() => cancelModif()}
								>
									cancel
								</span>
							</>
						) : (
							<span
								id='react-no-print'
								className='editBtn'
								onClick={() => setEditable(true)}
							>
								edit
							</span>
						)}
					</h1>
				</div>
				<div className='left-part'>
					<PersonalDetails data={data} studentID={studentMongoId} />
					<GuardianDetails data={data} />
					<SchoolClassDetails data={data} studentID={studentMongoId} />
				</div>
				<div className='right-part'>
					<h3>Attendance Last 5 days:</h3>
					<SmallDataTable>
						<table>
							<thead>
								<tr>
									<th>Day</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>{displayLastAttendance()}</tbody>
						</table>
					</SmallDataTable>
				</div>
			</PersonViewStyled>
		);
	}

	return (
		<div>
			<div id='react-no-print'>{displayStudentCompleteInfo()}</div>
			<PrintTemplate style={{ marginTop: '0' }}>
				<PrintHeader pageTitle={pageTitle} />
				{displayStudentCompleteInfo()}
			</PrintTemplate>
		</div>
	);
}

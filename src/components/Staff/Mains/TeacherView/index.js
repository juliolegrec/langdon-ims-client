import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import TeacherPersonalDetails from './TeacherPersonalDetails';
import ClassDetails from './ClassDetails';
import PersonViewStyled from '../../styles/PersonViewStyled';
import { capitalize } from '../../../../helpers';
import moment from 'moment';
import styled from 'styled-components';
import PrintTemplate from 'react-print';
import PrintHeader from '../../../PrintHeader';
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

export default function TeacherView(props) {
	const teacherMongoId = props.match.params.id;
	const SELECTED_TEACHER_INFO = gql`
	{
		teacherFromId(_id: "${teacherMongoId}")	{
			teacherID
    	firstName
    	lastName
			gender
			dob
			streetAddress
			city
			zipCode
			telephoneNumber
			emailAddress
			profilePic
			enrollmentDate
			classAssigned {
     	 	_id
      	classID
				grade
      	className
    	}
   		subjectTaught{
      	_id
      	subjectID
      	subjectName
    	}
  	}
	}
	`;

	const { loading, error, data } = useQuery(SELECTED_TEACHER_INFO);

	const [editable, setEditable] = useState(false);
	const [teacherID, setTeacherID] = useState('');
	const [teacherName, setTeacherName] = useState({});

	const pageTitle = 'Teacher Information';

	useEffect(() => {
		setTeacherName({
			firstName: data && data.teacherFromId.firstName,
			lastName: data && data.teacherFromId.lastName,
		});
		setTeacherID(data && data.teacherFromId.teacherID);
	}, [data]);

	const today = moment().format('YYYY-MM-DD');

	const GET_ATTENDANCE_PREVIOUS = gql`
		{
			teacherAttendance5days(date: "${today}", teacherID: "${teacherID}") {
				dateOfAttendance
				attendance {
					teacherID
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

	const UPDATE_TEACHER_NAME = gql`
		mutation {
			updateTeacherPersoInfo(
				_id: "${teacherMongoId}"
				firstName: "${capitalize(teacherName.firstName)}"
				lastName: "${teacherName.lastName}"
			) {
				_id
			}
		}
	`;

	const [updateNameInfo] = useMutation(UPDATE_TEACHER_NAME);

	if (loading) return <h1>Loading...</h1>;
	if (error) return <h1>Error!</h1>;

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

		const data = dataPrevAttendance.teacherAttendance5days;

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

	function displayTeacherCompleteInfo() {
		return (
			<PersonViewStyled>
				<TitleStyled id='react-no-print'>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<button
					id='react-no-print'
					className='go-back-btn'
					onClick={() => {
						props.history.push('/staff/teachers');
					}}
				>
					&lt; Back
				</button>
				<div className='person-header'>
					<h1 className='person-name'>
						{!editable ? (
							<span id='firstName'>{teacherName.firstName} </span>
						) : (
							<div id='firstName'>
								<label>First Name:</label>
								<input
									data-content='First Name'
									className={editable ? 'editable' : ''}
									type='text'
									value={teacherName.firstName}
									onChange={(e) => {
										setTeacherName({
											...teacherName,
											firstName: capitalize(e.target.value),
										});
									}}
								/>
							</div>
						)}
						{!editable ? (
							<span id='lastName'>{teacherName.lastName} </span>
						) : (
							<div id='lastName'>
								<label>Last Name:</label>
								<input
									data-content='Last Name'
									className={editable ? 'editable' : ''}
									type='text'
									value={teacherName.lastName}
									onChange={(e) => {
										setTeacherName({
											...teacherName,
											lastName: capitalize(e.target.value),
										});
									}}
								/>
							</div>
						)}
						<span id='teacherID'>&#40;{data.teacherFromId.teacherID}&#41;</span>
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
					<TeacherPersonalDetails data={data} teacherID={teacherMongoId} />
					<ClassDetails data={data} />
					{/* <SchoolClassDetails data={data} teacherID={teacherMongoId} /> */}
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
			<div id='react-no-print'>{displayTeacherCompleteInfo()}</div>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				{displayTeacherCompleteInfo()}
			</PrintTemplate>
		</div>
	);
}

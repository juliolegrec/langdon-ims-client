import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import StyledTable from '../../styles/StyledTable';
import StyledAttendanceForm from './styles/StyledAttendanceForm';
import moment from 'moment';
import styled from 'styled-components';
// import AttendanceStatus from './AttendanceStatus';

const StatusStyled = styled.span`
	font-weight: bold;
	text-transform: uppercase;

	&#presentStatus {
		color: #27ae60;
	}

	&#absentStatus {
		color: #e74c3c;
	}
`;

const WeekendMsg = styled.p`
	text-align: center;
	font-size: 2rem;
`;

export default function StudentAttendanceView() {
	const [selectedClass, setSelectedClass] = useState('13BLU');
	// const [selectedClass, setSelectedClass] = useState('11RED');
	const [selectedDate, setSelectedDate] = useState('2020-03-12');
	const [isEditable, setIsEditable] = useState(false);
	const [absentees, setAbsentees] = useState([]);
	console.log(absentees);

	const GET_ALL_CLASSES = gql`
		{
			allClasses {
				classID
				className
				grade
			}
		}
	`;

	const GET_STUDENTS_FROM_CLASS = gql`
		{
			studentFromClassID(classID: "${selectedClass}") {
				studentID
				firstName
				lastName
			}
		}
	`;
	const GET_ATTENDANCE_INFO = gql`
	{
		studentAttendanceFromDate(date: "${selectedDate}") {
			_id
			dateOfAttendance
			absentee {
				classRecorded
				absentees
			}
		}
	}
`;

	const {
		loading: loadingClasses,
		error: errorClasses,
		data: dataClasses,
	} = useQuery(GET_ALL_CLASSES);

	const {
		loading: loadingStudents,
		error: errorStudents,
		data: dataStudents,
	} = useQuery(GET_STUDENTS_FROM_CLASS);

	const {
		loading: loadingAttendance,
		error: errorAttendance,
		data: dataAttendance,
	} = useQuery(GET_ATTENDANCE_INFO, {
		onCompleted: (data) => {
			console.log(data.studentAttendanceFromDate);

			if (data && data.studentAttendanceFromDate) {
				const selectedClassData = data.studentAttendanceFromDate.absentee.filter(
					(x) => x.classRecorded === selectedClass
				);

				setAbsentees(selectedClassData[0].absentees);

				// setAbsenteesState(absentees);
			}
		},
	});

	function displayAttendanceStatus(student) {
		if (loadingAttendance) {
			return <span>Loading...</span>;
		}

		if (errorAttendance) {
			return <span>Error!</span>;
		}

		if (dataAttendance.studentAttendanceFromDate === null) {
			return <div>No Records...</div>;
		}

		if (absentees.indexOf(student) !== -1) {
			return <StatusStyled id='absentStatus'>ABSENT</StatusStyled>;
		} else if (absentees.indexOf(student) === -1) {
			return <StatusStyled id='presentStatus'>PRESENT</StatusStyled>;
		}

		// if (isEditable) {
		// 	return (
		// 		<label>
		// 			<input
		// 				type="checkbox"
		// 				checked={isAbsent ? true : false}
		// 				onChange={() => {
		// 					setIsAbsent(!isAbsent);
		// 					sendStudentAbsent();
		// 				}}
		// 			/>{' '}
		// 			&nbsp; Absent
		// 		</label>
		// 	);
		// } else {
		// 	return isAbsent ? (
		// 		<StatusStyled id="absentStatus">ABSENT</StatusStyled>
		// 	) : (
		// 		<StatusStyled id="presentStatus">PRESENT</StatusStyled>
		// 	);
		// }
	}

	function classList() {
		if (loadingClasses) {
			return <option>Loading...</option>;
		}
		if (errorClasses) {
			return <option>Error!</option>;
		}

		return dataClasses.allClasses
			.sort((a, b) => {
				return parseInt(a.grade) < parseInt(b.grade) ? -1 : 1;
			})
			.map((sClass) => {
				return (
					<option key={sClass.classID} value={sClass.classID}>
						{sClass.grade} {sClass.className}
					</option>
				);
			});
	}

	function displayStudents() {
		if (loadingStudents) {
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);
		}
		if (errorStudents) {
			return (
				<tr>
					<td>Error!</td>
				</tr>
			);
		}

		if (dataStudents && dataStudents.studentFromClassID) {
			if (dataStudents.studentFromClassID.length !== 0) {
				const students = dataStudents.studentFromClassID;
				return students.map((student) => {
					return (
						<tr key={student.studentID}>
							<td>{student.studentID}</td>
							<td>{student.firstName}</td>
							<td>{student.lastName}</td>
							<td>{displayAttendanceStatus(student.studentID)}</td>
							{/* <td>
								<AttendanceStatus
									student={student.studentID}
									date={selectedDate}
									selectedClass={selectedClass}
									isEditable={isEditable}
									absentees={absentees}
									registerAbsentee={absenteesReceiver}
								/> </td> */}
						</tr>
					);
				});
			}
		}

		return (
			<tr>
				<td colSpan='4'>No Students in this class</td>
			</tr>
		);
	}

	return (
		<StyledMain>
			<StyledAttendanceForm>
				<form>
					<label>
						Class:
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
						>
							{classList()}
							<option value='-'>-</option>
						</select>
					</label>
					<label>
						Record Date:
						<input
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							type='date'
						/>
					</label>
					{isEditable ? (
						<div id='btn-group'>
							<button id='save-btn'>SAVE</button>
							<button onClick={() => setIsEditable(false)} id='cancel-btn'>
								CANCEL
							</button>
						</div>
					) : (
						<button onClick={() => setIsEditable(true)}>Add/Update</button>
					)}
				</form>
			</StyledAttendanceForm>
			<StyledTable>
				{moment(selectedDate).weekday() === 0 ||
				moment(selectedDate).weekday() === 6 ? (
					<WeekendMsg>No School</WeekendMsg>
				) : (
					<table>
						<thead>
							<tr>
								<td>Student ID</td>
								<td>First Name</td>
								<td>Last Name</td>
								<td>Attendance</td>
							</tr>
						</thead>
						<tbody>{displayStudents()}</tbody>
					</table>
				)}
			</StyledTable>
		</StyledMain>
	);
}

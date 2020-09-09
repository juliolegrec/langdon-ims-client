import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import StyledMain from '../../styles/MainStyled';
import StyledTable from '../../styles/StyledTable';
import StyledAttendanceForm from './styles/StyledAttendanceForm';
import styled from 'styled-components';

const LoadingMsg = styled.tr`
	text-align: center;
	font-size: 2rem;
	font-weight: bold;
`;

const WeekendMsg = styled.p`
	text-align: center;
	font-size: 2rem;
`;

const StatusStyle = styled.span`
	font-weight: bold;
	text-transform: uppercase;

	&#presentStatus {
		color: #27ae60;
	}

	&#absentStatus {
		color: #e74c3c;
	}
`;

export default function StudentAttendanceView() {
	const [selectedClass, setSelectedClass] = useState('11RED');
	const [selectedDate, setSelectedDate] = useState('2020-03-12');
	const [isEditable, setIsEditable] = useState(false);
	const [isAbsent, setIsAbsent] = useState(true);

	const GET_STUDENTS_FROM_CLASS = gql`
	{
		studentFromClassID(classID: "${selectedClass}") {
			studentID
			firstName
			lastName
		}
	}
`;

	const GET_ALL_CLASSES = gql`
		{
			allClasses {
				classID
				className
				grade
			}
		}
	`;

	const GET_ABSENTEES = gql`
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

	const { loading, error, data } = useQuery(GET_STUDENTS_FROM_CLASS);
	const {
		loading: loadingClasses,
		error: errorClasses,
		data: dataClasses,
	} = useQuery(GET_ALL_CLASSES);

	const {
		loading: loadingAbsentees,
		error: errorAbsentees,
		data: dataAbsentees,
	} = useQuery(GET_ABSENTEES);

	function displayClasses() {
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

	function displayAttendanceStatus(selectedClass, student) {
		if (loadingAbsentees) {
			return <p>Loading...</p>;
		}

		if (errorAbsentees) {
			return <p>Error!</p>;
		}

		if (dataAbsentees.studentAttendanceFromDate === null) {
			return <span>No Records</span>;
		}

		if (dataAbsentees && dataAbsentees.studentAttendanceFromDate) {
			if (dataAbsentees.studentAttendanceFromDate !== null) {
				let selectedAttendance = dataAbsentees.studentAttendanceFromDate.absentee.filter(
					(x) => {
						return x.classRecorded === selectedClass;
					}
				);

				if (selectedAttendance.length !== 0) {
					if (selectedAttendance[0].absentees.length === 0) {
						return <StatusStyle id="presentStatus">PRESENT</StatusStyle>;
					}
				}

				// if (selectedAttendance[0].absentees.indexOf(student) === -1) {
				// 	if (isEditable) {
				// 		return (
				// 			<label>
				// 				<input
				// 					type="checkbox"
				// 					checked={!isAbsent}
				// 					onChange={(e) => setIsAbsent(!isAbsent)}
				// 				/>
				// 				&nbsp;PRESENT
				// 			</label>
				// 		);
				// 	} else {
				// 		return <StatusStyle id="presentStatus">PRESENT</StatusStyle>;
				// 	}
				// } else {
				// 	if (isEditable) {
				// 		return (
				// 			<label>
				// 				<input
				// 					type="checkbox"
				// 					checked={isAbsent}
				// 					onChange={(e) => setIsAbsent(!isAbsent)}
				// 				/>
				// 				&nbsp;ABSENT
				// 			</label>
				// 		);
				// 	} else {
				// 		return <StatusStyle id="absentStatus">ABSENT</StatusStyle>;
				// 	}
				// }
			}
		}
	}

	function displayRecords() {
		if (loading) {
			return (
				<LoadingMsg>
					<td colSpan="3">
						{' '}
						<img
							src="https://res.cloudinary.com/imperium/image/upload/c_scale,w_200/v1581344084/loading-spinner.gif"
							alt="spinner"
						/>{' '}
					</td>
				</LoadingMsg>
			);
		}

		if (error) {
			return <p>Error!</p>;
		}
		return data.studentFromClassID.map((student) => {
			return (
				<tr key={student.studentID}>
					<td>{student.studentID}</td>
					<td>{student.firstName}</td>
					<td>{student.lastName}</td>
					<td>{displayAttendanceStatus(selectedClass, student.studentID)}</td>
				</tr>
			);
		});
	}

	return (
		<StyledMain>
			<h1>Attendance Record</h1>
			<StyledAttendanceForm>
				<form>
					<label>
						Class:
						<select
							value={selectedClass}
							onChange={(e) => {
								setSelectedClass(e.target.value);
							}}
						>
							{displayClasses()}
							<option value="-">-</option>
						</select>
					</label>
					<label>
						Record Date:
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
						/>
					</label>
					{isEditable ? (
						<div id="btn-group">
							<button id="save-btn">SAVE</button>
							<button onClick={() => setIsEditable(false)} id="cancel-btn">
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
								<td>Status</td>
							</tr>
						</thead>
						<tbody>{displayRecords()}</tbody>
					</table>
				)}
			</StyledTable>
		</StyledMain>
	);
}

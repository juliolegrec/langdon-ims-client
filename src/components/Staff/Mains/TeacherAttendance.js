import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import DataTableStyled from '../styles/DataTableStyled';
import StyledMain from '../styles/MainStyled';
import TitleStyled from '../styles/TitleStyled';
import moment from 'moment';

const LoadingImage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: white;
	display: flex;
	justify-content: center;
	/* align-items: center; */
	opacity: 0.75;

	img {
		margin-top: 75px;
	}
`;

const AttendanceInputStyle = styled.div`
	width: 60%;
	display: grid;
	grid-template-columns: 40% 60%;
	grid-gap: 10px;
	margin-bottom: 10px;

	/* button {
		width: 50%;
	} */
`;

const ButtonGroupStyle = styled.div`
	display: flex;
	flex-direction: row;

	button {
		background-color: #2c3e50;
		border: 1px solid transparent;
		color: white;
		font-weight: bold;
		border-radius: 3px;
		cursor: pointer;
	}
	#edit-btn {
		background-color: #e67e22;
	}
	#save-btn {
		background-color: #2ecc71;
	}
	#cancel-btn {
		background-color: #e74c3c;
	}
`;

const GET_ALL_TEACHERS = gql`
	{
		allTeachers {
			_id
			teacherID
			firstName
			lastName
			classAssigned {
				_id
				classID
				className
				grade
			}
			subjectTaught {
				_id
				subjectID
				subjectName
			}
		}
	}
`;

export default function TeacherAttendance() {
	const [selectedDate, setSelectedDate] = useState(
		moment().format('YYYY-MM-DD')
	);
	const [updateStatus, setUpdateStatus] = useState([]);
	const [isEditable, setIsEditable] = useState(false);
	const [loadingActive, setLoadingActive] = useState(false);

	console.log(updateStatus);

	const pageTitle = 'Teachers Attendance';

	const { loading, error, data } = useQuery(GET_ALL_TEACHERS);

	const GET_ATTENDANCE_FROM_DATE = gql`
	{
		teacherAttendanceFromDate(date: "${selectedDate}"){
			_id
			dateOfAttendance
			attendance {
				teacherID
				status
			}
		}
	}
	`;

	const {
		loading: loadingAttendance,
		error: errorAttendance,
		data: dataAttendance,
	} = useQuery(GET_ATTENDANCE_FROM_DATE);

	const UPDATE_ATTENDANCE_STATUS = gql`
		mutation RegisterTeacherAttendance($toUpdateStatus: [TeacherStatusInput!]!){
			registerTeacherAttendance(
				teacherAttendanceInput: {
					dateOfAttendance: "${selectedDate}"
					attendance: $toUpdateStatus
				}
			) {
				_id
			}
		}
	`;

	const [updateAttendanceStatus] = useMutation(UPDATE_ATTENDANCE_STATUS, {
		onCompleted: () => {
			setLoadingActive(false);
		},
	});

	function displayTeachers() {
		if (loading) {
			return (
				<tr>
					<td colSpan='4'>Loading...</td>
				</tr>
			);
		}
		if (error) {
			return (
				<tr>
					<td colSpan='4'>Error...</td>
				</tr>
			);
		}

		const teachers = data.allTeachers;

		return teachers.map((teacher) => {
			return (
				<tr key={teacher._id}>
					<td>{teacher.teacherID}</td>
					<td>
						{teacher.firstName}{' '}
						<span style={{ textTransform: 'uppercase' }}>
							{teacher.lastName}
						</span>
					</td>
					<td>
						<ul style={{ listStyle: 'none', padding: '0' }}>
							{displayClassAssigned(teacher.classAssigned)}
						</ul>
					</td>
					<td>
						<ul style={{ listStyle: 'none', padding: '0' }}>
							{displaySubjectTeaching(teacher.subjectTaught)}
						</ul>
					</td>
					<td>
						{!isEditable
							? attendanceDisplay(teacher.teacherID)
							: attendanceInput(teacher.teacherID)}
					</td>
				</tr>
			);
		});
	}

	function displayClassAssigned(allClasses) {
		if (allClasses.length === 0) {
			return <p style={{ color: '#e74c3c' }}>No Class Assigned</p>;
		}

		if (allClasses) {
			return allClasses
				.sort((a, b) =>
					parseInt(a.grade) > parseInt(b.grade)
						? 1
						: parseInt(b.grade) > parseInt(a.grade)
						? -1
						: 0
				)
				.map((aClass) => {
					return (
						<li key={aClass._id}>
							{aClass.grade} {aClass.className}
						</li>
					);
				});
		}
	}

	function displaySubjectTeaching(allSubjects) {
		if (allSubjects.length === 0) {
			return <p style={{ color: '#e74c3c' }}>No Subject</p>;
		}

		if (allSubjects) {
			return allSubjects.map((subject) => {
				return <li key={subject._id}>{subject.subjectName}</li>;
			});
		}
	}

	function handleStatusInput(target, teacher) {
		let existingStatus = updateStatus.find(
			(element) => element.teacherID === teacher
		);
		// someStr.replace(/['"]+/g, '')
		if (!existingStatus) {
			let attendanceStatusObj = {
				teacherID: teacher,
				status: target.value.replace(/['"]+/g, ''),
			};
			setUpdateStatus([...updateStatus, attendanceStatusObj]);
		} else {
			const objIndex = updateStatus.findIndex(
				(element) => element.teacherID === teacher
			);

			const updatedStatus = {
				teacherID: teacher,
				status: target.value.replace(/['"]+/g, ''),
			};

			updateStatus.splice(objIndex, 1, updatedStatus);
		}
	}

	function attendanceInput(teacher) {
		return (
			<div
				id='status-input'
				onChange={(e) => handleStatusInput(e.target, teacher)}
			>
				<input type='radio' name={teacher} value='PRESENT' />
				Present&nbsp;
				<input type='radio' name={teacher} value='ABSENT' />
				Absent
			</div>
		);
	}

	function attendanceDisplay(teacher) {
		if (loadingAttendance) {
			return <p>Loading....</p>;
		}
		if (errorAttendance) {
			return <p>Error!</p>;
		}

		const newStatus = updateStatus.find(
			(element) => element.teacherID === teacher
		);

		if (newStatus) {
			return newStatus.status === 'ABSENT' ? (
				<span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
					{newStatus.status}
				</span>
			) : (
				<span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
					{newStatus.status}
				</span>
			);
		}

		const attendances = dataAttendance.teacherAttendanceFromDate;

		if (!attendances) {
			return <span>Not Recorded</span>;
		}

		if (attendances && attendances.attendance) {
			const teacherAttendance = attendances.attendance;

			const attendanceStatus = teacherAttendance.find(
				(teacherStatus) => teacherStatus.teacherID === teacher
			);
			const existingStatus = updateStatus.find(
				(element) => element.teacherID === teacher
			);

			if (existingStatus && existingStatus.status) {
				return existingStatus.status === 'ABSENT' ? (
					<span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
						{existingStatus.status}
					</span>
				) : (
					<span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
						{existingStatus.status}
					</span>
				);
			}

			return (
				<span>
					{attendanceStatus && attendanceStatus.status ? (
						attendanceStatus.status === 'ABSENT' ? (
							<span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
								{attendanceStatus.status}
							</span>
						) : (
							<span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
								{attendanceStatus.status}
							</span>
						)
					) : (
						'Not Recorded'
					)}
				</span>
			);
		}
	}

	function displayAttendanceTable() {
		return (
			<DataTableStyled>
				<table>
					<thead>
						<tr>
							<th>Teacher ID</th>
							<th>Teacher Name</th>
							<th>Classes Assigned To</th>
							<th>Subject Teaching</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>{displayTeachers()}</tbody>
				</table>
			</DataTableStyled>
		);
	}

	return (
		<div>
			<StyledMain id='react-no-print'>
				{loadingActive ? (
					<LoadingImage>
						<img
							style={{ position: 'absolute' }}
							src='https://res.cloudinary.com/imperium/image/upload/v1581344084/loading-spinner.gif'
							alt='loading'
						/>
						)
					</LoadingImage>
				) : (
					''
				)}
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>

				<AttendanceInputStyle>
					<input
						type='date'
						defaultValue={selectedDate}
						onChange={(e) => {
							setSelectedDate(e.target.value);
							setUpdateStatus([]);
						}}
					/>
					{isEditable ? (
						<ButtonGroupStyle>
							<button
								id='save-btn'
								disabled={selectedDate === '' ? 'disabled' : ''}
								style={{ marginRight: '10px' }}
								onClick={() => {
									if (updateStatus.length !== 0) {
										updateAttendanceStatus({
											variables: { toUpdateStatus: [...updateStatus] },
										});
									}
									setLoadingActive(true);
									setIsEditable(false);
								}}
							>
								SAVE
							</button>
							<button
								id='cancel-btn'
								onClick={() => {
									setUpdateStatus([]);
									setIsEditable(false);
								}}
							>
								CANCEL
							</button>
						</ButtonGroupStyle>
					) : (
						<ButtonGroupStyle>
							<button id='edit-btn' onClick={() => setIsEditable(true)}>
								EDIT
							</button>
						</ButtonGroupStyle>
					)}
				</AttendanceInputStyle>
				{displayAttendanceTable()}
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
					<p style={{ margin: '5mm 0' }}>
						<strong>Date:</strong> {moment(selectedDate).format('DD/MM/YYYY')}
					</p>
				</div>
				{displayAttendanceTable()}
			</PrintTemplate>
		</div>
	);
}

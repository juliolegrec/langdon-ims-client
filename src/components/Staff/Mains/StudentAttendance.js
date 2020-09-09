import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import StyledMain from '../styles/MainStyled';
import moment from 'moment';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import DataTableStyled from '../styles/DataTableStyled';
import TitleStyled from '../styles/TitleStyled';

const MainAttendance = styled.div`
	display: grid;
	grid-gap: 10px;
	grid-template-columns: 25% 75%;

	h3 {
		text-align: center;
		margin-bottom: 10px;
		text-transform: uppercase;
	}
`;

const ClassesListStyle = styled.div`
	min-height: 50px;
	width: 100%;
	padding: 5px;
	background: #ecf0f1;
	border: 1px solid #bdc3c7;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	font-size: 16px;
	cursor: pointer;

	&.selectedItem {
		background: #bdc3c7;
	}

	&:hover {
		background: #bdc3c7;
	}

	#grade-label,
	#class-name-label,
	#classID-label {
		pointer-events: none;
	}

	#grade-label {
		grid-column-start: 1;
		grid-column-end: 3;
		font-size: 0.85em;
		align-self: center;
	}

	#class-name-label {
		font-weight: bold;
		font-size: 1.15em;
	}

	#classID-label {
		justify-self: right;
	}
`;

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

const ButtonGroupStyle = styled.div`
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

const NameLinkStyled = styled.a`
	color: #2d3f50;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const GET_ALL_INFOS = gql`
	{
		allClasses {
			_id
			grade
			className
			classID
		}
	}
`;

export default function StudentAttendance() {
	const [selectedClass, setSelectedClass] = useState('');
	const [selectedDate, setSelectedDate] = useState(
		moment().format('YYYY-MM-DD')
	);
	const [isEditable, setIsEditable] = useState(false);
	const [updateStatus, setUpdateStatus] = useState([]);
	const [loadingActive, setLoadingActive] = useState(false);

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	const pageTitle = 'Student Attendance';

	console.log(updateStatus);

	const GET_STUDENTS_FROM_CLASSID = gql`
	{
			studentFromClassID(classID: "${selectedClass}") {
				_id	
				studentID
				firstName
				lastName
			}
		}
	`;

	const GET_ATTENDANCE_FROM_DATE = gql`
		{
			studentAttendanceFromDate(date: "${selectedDate}") {
				_id
				dateOfAttendance
				attendance {
					studentID
					status
				}
			}
		}
	`;

	const {
		loading: loadingStudent,
		error: errorStudent,
		data: dataStudent,
	} = useQuery(GET_STUDENTS_FROM_CLASSID);

	const {
		loading: loadingAttendance,
		error: errorAttendance,
		data: dataAttendance,
	} = useQuery(GET_ATTENDANCE_FROM_DATE);

	const UPDATE_ATTENDANCE_STATUS = gql`
		mutation RegisterStudentAttendance($toUpdateStatus: [StudentStatusInput!]!) {
			registerStudentAttendance(
				studentAttendanceInput: {
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

	function listClasses() {
		if (loading) return <div>Loading...</div>;
		if (error) return <div>Error!</div>;

		const classes = data.allClasses;
		return classes
			.sort((a, b) =>
				parseInt(a.grade) > parseInt(b.grade)
					? 1
					: parseInt(b.grade) > parseInt(a.grade)
					? -1
					: 0
			)
			.map((gradeClass) => {
				return (
					<ClassesListStyle
						key={gradeClass._id}
						id={gradeClass.classID}
						onClick={(e) => {
							setSelectedClass(e.target.id);
							for (let i = 0; i < e.target.parentNode.childNodes.length; i++) {
								e.target.parentNode.childNodes[i].classList.remove(
									'selectedItem'
								);
							}
							e.target.classList.add('selectedItem');
							setUpdateStatus([]);
						}}
					>
						<div id='grade-label'>Grade: </div>
						<div id='class-name-label'>
							{gradeClass.grade} {gradeClass.className}{' '}
						</div>
						<div id='classID-label'>({gradeClass.classID})</div>
					</ClassesListStyle>
				);
			});
	}

	function handleStatusInput(target, student) {
		let existingStatus = updateStatus.find(
			(element) => element.studentID === student
		);
		// someStr.replace(/['"]+/g, '')
		if (!existingStatus) {
			let attendanceStatusObj = {
				studentID: student,
				status: target.value.replace(/['"]+/g, ''),
			};
			setUpdateStatus([...updateStatus, attendanceStatusObj]);
		} else {
			const objIndex = updateStatus.findIndex(
				(element) => element.studentID === student
			);

			const updatedStatus = {
				studentID: student,
				status: target.value.replace(/['"]+/g, ''),
			};

			updateStatus.splice(objIndex, 1, updatedStatus);
		}
	}

	function attendanceInput(student) {
		return (
			<div
				id='status-input'
				onChange={(e) => handleStatusInput(e.target, student)}
			>
				<input type='radio' name={student} value='PRESENT' />
				Present&nbsp;
				<input type='radio' name={student} value='ABSENT' />
				Absent
			</div>
		);
	}

	function attendanceDisplay(student) {
		const newStatus = updateStatus.find(
			(element) => element.studentID === student
		);
		if (newStatus) {
			return (
				<span>
					{newStatus.status === 'ABSENT' ? (
						<span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
							{newStatus.status}
						</span>
					) : (
						<span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
							{newStatus.status}
						</span>
					)}
				</span>
			);
		}

		if (loadingAttendance) {
			return <p>Loading...</p>;
		}
		if (errorAttendance) {
			return <p>Error!</p>;
		}

		const attendances = dataAttendance.studentAttendanceFromDate;

		if (attendances && attendances.attendance) {
			const studentAttendance = attendances.attendance;

			const attendanceStatus = studentAttendance.find(
				(studentStatus) => studentStatus.studentID === student
			);

			const existingStatus = updateStatus.find(
				(element) => element.studentID === student
			);

			if (existingStatus) {
				return (
					<span>
						{existingStatus && existingStatus.status ? (
							existingStatus.status === 'ABSENT' ? (
								<span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
									{existingStatus.status}
								</span>
							) : (
								<span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
									{existingStatus.status}
								</span>
							)
						) : (
							'Not Recorded'
						)}
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

	function listStudents() {
		if (loadingStudent)
			return (
				<tr>
					<td colSpan='3'>Loading...</td>
				</tr>
			);
		if (errorStudent)
			return (
				<tr>
					<td colSpan='3'>Error!</td>
				</tr>
			);

		const students = dataStudent.studentFromClassID;

		return students.map((student) => {
			return (
				<tr key={student._id}>
					<td>{student.studentID}</td>
					<td>
						<NameLinkStyled href={`/staff/student/${student._id}`}>
							{student.firstName}{' '}
							<span style={{ textTransform: 'uppercase' }}>
								{student.lastName}
							</span>
						</NameLinkStyled>
					</td>
					<td>
						{isEditable
							? attendanceInput(student.studentID)
							: attendanceDisplay(student.studentID)}
					</td>
				</tr>
			);
		});
	}

	function displayAttendanceTable() {
		return (
			<DataTableStyled>
				<table>
					<thead>
						<tr>
							<th>Student ID</th>
							<th>Student name</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>{listStudents()}</tbody>
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
					</LoadingImage>
				) : (
					''
				)}
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				<MainAttendance>
					<div id='left-column'>
						<h3>CLASSES LIST</h3>
						{listClasses()}
					</div>
					<div id='right-column'>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '40% 30% 30%',
								gridGap: '10px',
								alignItems: 'center',
								marginBottom: '10px',
							}}
						>
							<h3 style={{ margin: 0, textAlign: 'left' }}>
								STUDENT ATTENDANCE{' '}
							</h3>
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
						</div>
						{displayAttendanceTable()}
					</div>
				</MainAttendance>
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
					<p style={{ margin: '5mm 0' }}>
						<strong>Date:</strong> {moment(selectedDate).format('DD/MM/YYYY')}
					</p>
					<p style={{ margin: '5mm 0' }}>
						<strong>Grade:</strong> {selectedClass}
					</p>
				</div>
				{displayAttendanceTable()}
			</PrintTemplate>
		</div>
	);
}

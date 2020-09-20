import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../styles/MainStyled';
import DataTableStyled from '../styles/DataTableStyled';
import styled from 'styled-components';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import TitleStyled from '../styles/TitleStyled';

const MainTimetable = styled.div`
	display: grid;
	grid-gap: 10px;
	grid-template-columns: 20% 80%;

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

const ButtonGroupStyle = styled.div`
	display: flex;
	flex-direction: row;
	justify-self: right;
	button {
		background-color: #2c3e50;
		border: 1px solid transparent;
		color: white;
		font-weight: bold;
		border-radius: 3px;
		cursor: pointer;
		align-self: right;
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

const LoadingImage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: white;
	display: flex;
	justify-content: center;
	opacity: 0.75;

	img {
		margin-top: 75px;
	}
`;

const SelectStyled = styled.select`
	width: 100%;
	margin: 5px 0;
	padding: 5px;
`;

export default function Timetable() {
	const [selectedClass, setSelectedClass] = useState('');
	const [isEditable, setIsEditable] = useState(false);
	const [updateSubject, setUpdateSubject] = useState([]);
	const [loadingActive, setLoadingActive] = useState(false);

	const pageTitle = 'Timetable';

	const GET_ALL_INFOS = gql`
		{
			allClassHours {
				_id
				hourName
				beginTime
				endTime
				type
			}
			allClasses {
				_id
				grade
				className
				classID
			}

			allSubjects {
				_id
				subjectID
				subjectName
				teachedBy {
					teacherID
					firstName
					lastName
				}
			}

			allTeachers {
				_id
				teacherID
				firstName
				lastName
				subjectTaught {
					subjectID
					subjectName
				}
			}
		}
	`;

	const GET_TIMETABLE_FROM_CLASS = gql`
		{
			timetableFromClassID(classID: "${selectedClass}") {
				_id
				slots {
					slotTag
					subjectID
					teacherID
				}
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	const {
		loading: loadingTimetable,
		error: errorTimetable,
		data: dataTimetable,
	} = useQuery(GET_TIMETABLE_FROM_CLASS);

	const UPDATE_TIMETABLE = gql`
		mutation RegisterTimetable($toUpdateTimetable: [DaySubjectInput!]!) {
			registerTimetable(
				timetableInput: { classID: "${selectedClass}", slots: $toUpdateTimetable }
			) {
				_id
			}
		}
	`;

	const [updateTimetable] = useMutation(UPDATE_TIMETABLE, {
		onCompleted: () => {
			setLoadingActive(false);
		},
	});

	function getClassName(classID) {
		if (loading) {
			return <span>Loading...</span>;
		}
		if (error) {
			return <span>Error</span>;
		}
		const classes = data.allClasses;

		// if (classes && classes.classID) {
		const selectedClass = classes.find(
			(element) => element.classID === classID
		);

		if (selectedClass !== undefined) {
			return (
				<span>
					{selectedClass.grade} {selectedClass.className}
				</span>
			);
		}

		// }
	}

	function listClasses() {
		if (loading) {
			return <div>Loading...</div>;
		}
		if (error) {
			return <div>Error</div>;
		}

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

	function displaySubjects(day, period) {
		if (loadingTimetable) {
			return <td>Loading</td>;
		}
		if (errorTimetable) {
			return <td>Error</td>;
		}

		const subjects = data.allSubjects;

		const existingUpdate = updateSubject.find(
			(element) => element.slotTag === `${day}${period}`
		);
		if (existingUpdate) {
			const selectedSubject = subjects.find(
				(element) => element.subjectID === existingUpdate.subjectID
			);
			return <td>{selectedSubject.subjectName}</td>;
		}

		if (dataTimetable && dataTimetable.timetableFromClassID) {
			const timetable = dataTimetable.timetableFromClassID;

			const existingRecord = timetable.slots.find(
				(element) => element.slotTag === `${day}${period}`
			);
			if (!existingRecord) {
				return <td style={{ color: 'dodgerBlue' }}>-</td>;
			} else {
				const selectedSubject = subjects.find(
					(element) => element.subjectID === existingRecord.subjectID
				);

				return <td>{selectedSubject.subjectName}</td>;
			}
		}
	}

	function subjectInput(day, period) {
		if (loading) {
			return <td>loading</td>;
		}
		if (error) {
			return <td>error</td>;
		}

		const subjects = data.allSubjects;
		// const teachers = data.allTeachers;

		if (dataTimetable && dataTimetable.timetableFromClassID) {
			const timetable = dataTimetable.timetableFromClassID;

			const existingRecord = timetable.slots.find(
				(element) => element.slotTag === `${day}${period}`
			);

			if (existingRecord) {
				const selectedSubject = subjects.find(
					(element) => element.subjectID === existingRecord.subjectID
				);

				return (
					<td>
						<SelectStyled
							onChange={(e) => handleSubjectInput(day, period, e.target.value)}
							defaultValue={selectedSubject.subjectID}
						>
							{subjects.map((subject) => {
								return (
									<option key={subject._id} value={subject.subjectID}>
										{subject.subjectName}
									</option>
								);
							})}
						</SelectStyled>
					</td>
				);
			}
		}
		return (
			<td style={{ color: 'dodgerBlue' }}>
				<select
					onChange={(e) => handleSubjectInput(day, period, e.target.value)}
				>
					{subjects.map((subject) => {
						return (
							<option key={subject._id} value={subject.subjectID}>
								{subject.subjectName}
							</option>
						);
					})}
				</select>
			</td>
		);
	}

	function handleSubjectInput(day, period, value) {
		let existingSubject = updateSubject.find(
			(element) => element.slotTag === `${day}${period}`
		);

		if (!existingSubject) {
			let subjectObj = {
				slotTag: `${day}${period}`,
				subjectID: value,
			};
			setUpdateSubject([...updateSubject, subjectObj]);
		} else {
			const objIndex = updateSubject.findIndex(
				(element) => element.slotTag === `${day}${period}`
			);

			const updatedSubject = {
				slotTag: `${day}${period}`,
				subjectID: value,
			};

			updateSubject.splice(objIndex, 1, updatedSubject);
		}
	}

	function displayHours() {
		if (loading) {
			return (
				<tr>
					<td colSpan='7'>Loading</td>
				</tr>
			);
		}
		if (error) {
			return (
				<tr>
					<td colSpan='7'>Error</td>
				</tr>
			);
		}

		const periods = data.allClassHours;

		return periods.map((period) => {
			if (period.type === 'BREAK') {
				return (
					<tr key={period._id}>
						<td colSpan='7'>
							<strong>{period.hourName}:</strong> {period.beginTime} -{' '}
							{period.endTime}
						</td>
					</tr>
				);
			}
			return (
				<tr key={period._id}>
					<td>{period.hourName}</td>
					<td>
						{period.beginTime} - {period.endTime}
					</td>
					{isEditable
						? subjectInput('MON-', period.hourName)
						: displaySubjects('MON-', period.hourName)}
					{isEditable
						? subjectInput('TUE-', period.hourName)
						: displaySubjects('TUE-', period.hourName)}
					{isEditable
						? subjectInput('WED-', period.hourName)
						: displaySubjects('WED-', period.hourName)}
					{isEditable
						? subjectInput('THU-', period.hourName)
						: displaySubjects('THU-', period.hourName)}
					{isEditable
						? subjectInput('FRI-', period.hourName)
						: displaySubjects('FRI-', period.hourName)}
				</tr>
			);
		});
	}

	function displayDataTable() {
		return (
			<DataTableStyled>
				<table>
					<thead>
						<tr>
							<th>Period</th>
							<th>Time</th>
							<th>Monday</th>
							<th>Tuesday</th>
							<th>Wednesday</th>
							<th>Thursday</th>
							<th>Friday</th>
						</tr>
					</thead>
					<tbody>{displayHours()}</tbody>
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
				<MainTimetable>
					<div id='left-column'>
						<h3>Classes List</h3>
						{listClasses()}
					</div>
					<div id='right-column'>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'auto auto',
								gridGap: '10px',
								alignItems: 'center',
							}}
						>
							<h3 style={{ textAlign: 'left' }}>CLASS TIMETABLE </h3>

							{isEditable ? (
								<ButtonGroupStyle>
									<button
										id='save-btn'
										style={{ marginRight: '10px' }}
										onClick={() => {
											updateTimetable({
												variables: { toUpdateTimetable: [...updateSubject] },
											});
											setLoadingActive(true);
											setIsEditable(false);
										}}
									>
										SAVE
									</button>
									<button id='cancel-btn' onClick={() => setIsEditable(false)}>
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
						{displayDataTable()}
					</div>
				</MainTimetable>
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<p style={{ margin: '5mm 0' }}>
					<strong>Grade: </strong>
					{getClassName(selectedClass)}
				</p>
				{displayDataTable()}
			</PrintTemplate>
		</div>
	);
}

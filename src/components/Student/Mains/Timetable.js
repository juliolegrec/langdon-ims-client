import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../styles/MainStyled';
import DataTableStyled from '../styles/DataTableStyled';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import TitleStyled from '../styles/TitleStyled';

export default function Timetable() {
	const pageTitle = 'My Timetable';

	let state = JSON.parse(localStorage.getItem('state'));
	let { username } = state.sessionState.authUser;

	const STUDENT_INFO = gql`
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
			}
		findStudentFromUsername(username: "${username}"){
			_id
			studentID
			classDetails {
				_id
				classID
				className
				grade
			}
		}
	}
	`;

	const { loading, error, data } = useQuery(STUDENT_INFO);

	// useState

	// if (loading) {
	// 	return 'loading';
	// }
	// if (error) {
	// 	return 'error';
	// }

	const studentData = data && data.findStudentFromUsername;

	const classID = studentData && studentData?.classDetails.classID;

	const GET_TIMETABLE_FROM_CLASS = gql`
		{
			timetableFromClassID(classID: "${classID}") {
				_id
				slots {
					slotTag
					subjectID
				}
			}
		}
	`;

	const {
		loading: loadingTimetable,
		error: errorTimetable,
		data: dataTimetable,
	} = useQuery(GET_TIMETABLE_FROM_CLASS);

	console.log(dataTimetable);

	function getClassName(classID) {
		if (loading) {
			return <span>Loading...</span>;
		}
		if (error) {
			return <span>Error</span>;
		}
		const classes = data.allClasses;

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
	}

	function displaySubjects(day, period) {
		if (loadingTimetable) {
			return <td>Loading</td>;
		}
		if (errorTimetable) {
			return <td>Error</td>;
		}

		const subjects = data.allSubjects;

		// const existingUpdate = updateSubject.find(
		// 	(element) => element.slotTag === `${day}${period}`
		// );
		// if (existingUpdate) {
		// const selectedSubject = subjects.find(
		// 	(element) => element.subjectID === existingUpdate.subjectID
		// );
		// return <td>{selectedSubject.subjectName}</td>;
		// }

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

	function displayHours() {
		if (loading) {
			return (
				<tr>
					<td colSpan="7">Loading</td>
				</tr>
			);
		}
		if (error) {
			return (
				<tr>
					<td colSpan="7">Error</td>
				</tr>
			);
		}

		const periods = data.allClassHours;

		return periods.map((period) => {
			if (period.type === 'BREAK') {
				return (
					<tr key={period._id}>
						<td colSpan="7">
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
					{displaySubjects('MON-', period.hourName)}
					{displaySubjects('TUE-', period.hourName)}
					{displaySubjects('WED-', period.hourName)}
					{displaySubjects('THU-', period.hourName)}
					{displaySubjects('FRI-', period.hourName)}
				</tr>
			);
		});
	}

	function displayData() {
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
			<StyledMain id="react-no-print">
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				<p style={{ margin: '5mm 0' }}>
					<strong>Grade: </strong>
					{getClassName(classID)}
				</p>
				{displayData()}
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<p style={{ margin: '5mm 0' }}>
					<strong>Grade: </strong>
					{getClassName(classID)}
				</p>
				{displayData()}
			</PrintTemplate>
		</div>
	);
}

import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';

const TimetableStyled = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	height: 100px;

	.slots {
		display: grid;
		grid-template-columns: auto 1fr;
		padding: 5px;
		height: 100%;
		border: 1px solid #34495e;
		cursor: pointer;

		&:hover {
			background-color: #ecf0f1;
		}

		p:nth-child(1) {
			font-size: 0.85rem;
			font-weight: bold;
			border-radius: 5px;
			padding: 3px 3px 0;
			color: white;
			background-color: #3498db;
		}

		p:nth-child(2) {
			justify-self: end;
		}

		p:nth-child(3) {
			grid-column-start: 1;
			grid-column-end: 3;
			font-weight: bold;
			font-size: 1.2rem;
		}
	}
`;

const CalendarStyled = styled.section`
	border: 1px solid #a0a096;

	h3 {
		width: 100%;
		margin-bottom: 10px;
		padding: 10px 15px;
		background: #ccc;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;

		li {
			padding: 10px 15px;
		}
	}
`;

export default function TimetableWidget(props) {
	// const today = moment().format('ddd').toUpperCase();
	const today = 'FRI';

	const ALL_INFOS = gql`
		{
			allSubjects {
				_id
				subjectID
				subjectName
			}
			allClassHours {
				_id
				hourName
				beginTime
				endTime
			}

			allSchoolTerms {
				_id
				termName
				beginDate
				endDate
			}
		}
	`;

	const { loading, error, data } = useQuery(ALL_INFOS);
	const TIMETABLE_FROM_CLASS = gql`
		{
			timetableFromClassID(classID: "${props.classID}") {
				_id
				classID
				slots {
					subjectID
					slotTag
				}
			}
		}
  `;

	const {
		loading: loadingTimetable,
		error: errorTimetable,
		data: dataTimetable,
	} = useQuery(TIMETABLE_FROM_CLASS);

	if (loadingTimetable) {
		return 'Loading';
	}
	if (errorTimetable) {
		return 'Error';
	}

	const timetable = dataTimetable.timetableFromClassID;

	let currentDayTimetable = [];

	timetable.slots.forEach((element) => {
		if (element.slotTag.substring(0, 3) === today) {
			currentDayTimetable.push(element);
		}
	});

	const sortedTimetable = currentDayTimetable.sort((a, b) =>
		parseInt(a.slotTag.substring(4, 5)) > parseInt(b.slotTag.substring(4, 5))
			? 1
			: -1
	);

	function displatTimetable(sortedTimetable) {
		if (loading) {
			return 'Loading...';
		}
		if (error) {
			return 'Error!';
		}

		const allClassHours = data.allClassHours;
		const allSubjects = data.allSubjects;

		let final = [];

		sortedTimetable.forEach((element) => {
			let detailed = allSubjects.find(
				(subject) => subject.subjectID === element.subjectID
			);

			final.push({ ...element, ...detailed });
		});

		function displayPeriodTime(x) {
			const periodTime = allClassHours.find(
				(element) => element.hourName === x.slotTag.substring(4, 7)
			);

			return (
				<p>
					{periodTime.beginTime} - {periodTime.endTime}
				</p>
			);
		}

		console.log(final);

		return final.map((slot) => {
			return (
				<div key={slot.slotTag.substring(4, 7)} className='slots'>
					<p>{slot.slotTag.substring(4, 7)}</p>
					{displayPeriodTime(slot)}
					<p>{slot.subjectName}</p>
				</div>
			);
		});
	}

	function displaySchoolTerms() {
		if (loading) return '...';
		if (error) return 'Error!';

		const schoolTerms = data.allSchoolTerms;

		return schoolTerms.map((term) => {
			return (
				<li key={term._id}>
					<strong>{term.termName}:</strong>{' '}
					{moment(term.beginDate).format('Do MMMM YYYY')} to{' '}
					{moment(term.endDate).format('Do MMMM YYYY')}
				</li>
			);
		});
	}

	return (
		<section>
			<h3>Today's Timetable</h3>
			<TimetableStyled>{displatTimetable(sortedTimetable)}</TimetableStyled>
			<CalendarStyled>
				<h3>Academic Year</h3>
				<ul>{displaySchoolTerms()}</ul>
			</CalendarStyled>
			<CalendarStyled>
				<h3>Exams</h3>
				<ul>
					<li>
						<strong>1st term:</strong> 1st April 2019 to 12th April 2019
					</li>
					<li>
						<strong>2nd term:</strong> 8th July 2019 to 19th July 2019
					</li>
					<li>
						<strong>3rd term:</strong> 20th October 2019 to 31st October 2019
					</li>
				</ul>
			</CalendarStyled>
		</section>
	);
}

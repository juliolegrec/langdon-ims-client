import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';

const TimetableStyled = styled.div`
	display: grid;
	grid-template-columns: repeat(8, 1fr);

	.slots {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(3, auto);
		padding: 5px;
		height: 100%;
		border: 1px solid #34495e;
		cursor: pointer;
		text-align: center;

		&:hover {
			background-color: #ecf0f1;
		}

		p:nth-child(1) {
			font-weight: bold;
			border-radius: 5px;
			color: white;
			background-color: #9b59b6;
			margin-bottom: 3px;
		}

		p:nth-child(2) {
			font-size: 0.85rem;
		}

		p:nth-child(3) {
			/* grid-column-start: 1;
			grid-column-end: 3; */
			font-weight: bold;
			font-size: 1.2rem;
			margin-top: 10px;
		}
	}

	/* @media only screen and (max-width: 768px) {
		flex
	} */
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

	function displayTimetable(sortedTimetable) {
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

	return (
		<section>
			<h3>Today's Timetable</h3>
			<TimetableStyled>{displayTimetable(sortedTimetable)}</TimetableStyled>
		</section>
	);
}

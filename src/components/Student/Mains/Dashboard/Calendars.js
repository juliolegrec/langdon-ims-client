import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';

const CalendarStyled = styled.section`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
	margin-top: 20px;

	.academic-calendar,
	.exams-calendar {
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
	}

	@media only screen and (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export default function Calendars() {
	const ALL_INFOS = gql`
		{
			allSchoolTerms {
				_id
				termName
				beginDate
				endDate
			}
		}
	`;

	const { loading, error, data } = useQuery(ALL_INFOS);

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
		<CalendarStyled>
			<div className="academic-calendar">
				<h3>Academic Year</h3>
				<ul>{displaySchoolTerms()}</ul>
			</div>
			<div className="exams-calendar">
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
			</div>
		</CalendarStyled>
	);
}

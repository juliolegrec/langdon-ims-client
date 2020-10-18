import React, {useState, useEffect} from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import DashboardMainStyled from '../styles/DashBoardMainStyled';
// import Calendar from 'react-calendar/dist/entry.nostyle';
import moment from 'moment';
import '../styles/CalendarStyles.css';

export default function Dashboard() {
	const [examDisplay, setExamDisplay] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setExamDisplay(true)
		}, 1500);
	})

	const GET_ACTIVE_STU_TEA_COUNT = gql`
		{
			totalStudents
			totalTeachers
			totalStudentAttendanceRecordedOnDate(date: "${moment(Date.now()).format(
				'YYYY-MM-DD'
			)}")
			totalStudentPresentOnDate(date: "${moment(Date.now()).format('YYYY-MM-DD')}")
			totalTeacherAttendanceRecordedOnDate(date: "${moment(Date.now()).format(
				'YYYY-MM-DD'
			)}")
			totalTeacherPresentOnDate(date: "${moment(Date.now()).format('YYYY-MM-DD')}")
		}
	`;

	const GET_SCHOOL_TERMS = gql`
		{
			allSchoolTerms {
				_id
				termName
				beginDate
				endDate
			}
		}
	`;

	const {
		loading: loadingCounts,
		error: errorCounts,
		data: dataCounts,
	} = useQuery(GET_ACTIVE_STU_TEA_COUNT);

	const {
		loading: loadingTerms,
		error: errorTerms,
		data: dataTerms,
	} = useQuery(GET_SCHOOL_TERMS);

	function activeStudentCount() {
		if (loadingCounts) return '...';
		if (errorCounts) return 'Error!';

		return dataCounts.totalStudents;
	}

	function activeTeacherCount() {
		if (loadingCounts) return '...';
		if (errorCounts) return 'Error!';

		return dataCounts.totalTeachers;
	}

	function studentAttendanceRecorded() {
		if (loadingCounts) return '...';
		if (errorCounts) return 'Error!';

		return dataCounts.totalStudentAttendanceRecordedOnDate;
	}

	function studentPresentCount() {
		if (loadingCounts) return '...';
		if (errorCounts) return 'Error!';

		return dataCounts.totalStudentPresentOnDate;
	}
	function teacherAttendanceRecorded() {
		if (loadingCounts) return '...';
		if (errorCounts) return 'Error!';

		return dataCounts.totalTeacherAttendanceRecordedOnDate;
	}
	function teacherPresentCount() {
		if (loadingCounts) return '...';
		if (errorCounts) return 'Error!';

		return dataCounts.totalTeacherPresentOnDate;
	}

	function displaySchoolTerms() {
		if (loadingTerms) return '...';
		if (errorTerms) return 'Error!';

		const schoolTerms = dataTerms.allSchoolTerms;

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
		<DashboardMainStyled>
			<h2>Dashboard</h2>
			<section className="stats">
				<div className="stats-box">
					<h3>{activeStudentCount()}</h3>
					<p>students registered</p>
				</div>
				<div className="stats-box">
					<h3>{studentPresentCount()}</h3>
					<p>students present</p>
					<p className="sub-text">
						(<span>{studentAttendanceRecorded()}</span> students recorded)
					</p>
				</div>
				<div className="stats-box">
					<h3>{activeTeacherCount()}</h3>
					<p>teachers registered</p>
				</div>
				<div className="stats-box">
					<h3>{teacherPresentCount()}</h3>
					<p>teachers present</p>
					<p className="sub-text">
						(<span>{teacherAttendanceRecorded()}</span> teachers recorded)
					</p>
				</div>
			</section>
			{/* <section className="calendar">
				<Calendar />
			</section> */}
			<section className="academic-calendar">
				<h3>Academic Year</h3>
				<ul>{displaySchoolTerms()}</ul>
			</section>
			<section className="exams-calendar">
				<h3>Exams</h3>
				{
					examDisplay ?
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
				</ul> : ""
				}
			</section>
		</DashboardMainStyled>
	);
}

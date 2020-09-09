import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../styles/MainStyled';
import StyledTable from '../styles/StyledTable';
import styled from 'styled-components';
import moment from 'moment';

const FilterHeaderStyled = styled.div`
	height: 50px;
	width: 100%;
	margin-bottom: 10px;

	form {
		height: 100%;
		display: flex;
		justify-content: space-between;
		width: 100%;
		label {
			width: 100%;

			select {
				width: 90%;
				height: 75%;
				border: 1px solid #ddd;
				border-radius: 0.25rem;
				padding-left: 10px;
				font-size: 1.15rem;
			}
		}

		button {
			width: 200px;
			height: 75%;
			background-color: #0068d9;
			color: white;
			font-weight: bold;
			font-size: 1rem;
			cursor: pointer;
			border: 1px solid transparent;
			border-radius: 0.25rem;
		}
	}
`;

const infoBar = {
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	jsutifyContent: 'space-around',
};

const markingStyle = {
	fontSize: '1rem',
	background: 'transparent',
	border: '1px solid transparent',
	textAlign: 'center',
};

const GET_ALL_INFOS = gql`
	{
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

		allExams {
			_id
			examID
			examDate
			gradeClass
			subject
		}
		allAssessments {
			_id
			assessmentID
			assessmentDate
			gradeClass
			subject
		}
	}
`;

export default function Markings() {
	const [selectedData, setSelectedData] = useState(['1', '2']);
	console.log(selectedData);
	const [updatedInfo, setUpdatedInfo] = useState([]);
	console.log(updatedInfo);
	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	const GET_STUDENTS_FROM_CLASSID = gql`
		{
			studentFromClassID(classID:"${selectedData[0]}") {
				_id	
				studentID
				firstName
				lastName
			}
		}
	`;

	const GET_ASSESSMENT_MARKS_FROM_ID = gql`
		{
			markingsFromAssessmentID(assessmentID: "${selectedData[1]}") {
				_id
				assessmentID
				studentMarks {
					studentID
					markings
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
		loading: loadingAssessmentMarks,
		error: errorAssessmentMarks,
		data: dataAssessmentMarks,
	} = useQuery(GET_ASSESSMENT_MARKS_FROM_ID);

	useEffect(() => {
		setUpdatedInfo(dataAssessmentMarks);
	}, [dataAssessmentMarks]);

	if (loading || loadingStudent || loadingAssessmentMarks) {
		return <h1>Loading...</h1>;
	}
	if (error || errorStudent || errorAssessmentMarks) {
		return <h1>Error!</h1>;
	}

	const initialAssessmentMarkings = dataAssessmentMarks.markingsFromAssessmentID || [
		{
			studentID: 'NA',
			markings: 'NA',
		},
	];

	function assessmentList() {
		const assessments = data.allAssessments;

		console.log(assessments);

		return assessments.map((assessment) => {
			return (
				<option
					key={assessment._id}
					value={assessment.gradeClass + ',' + assessment.assessmentID}
				>
					({assessment.assessmentID}){' '}
					{moment(assessment.assessmentDate).format('DD MMM YY')}
					{' - '}
					{assessment.gradeClass}
					{' - '}
					{assessment.subject}
				</option>
			);
		});
	}
	function examList() {
		const exams = data.allExams;

		return exams.map((exam) => {
			return (
				<option key={exam._id} value={exam.gradeClass + ',' + exam.examID}>
					({exam.examID}) {moment(exam.examDate).format('DD MMM YY')}
					{' - '}
					{exam.gradeClass}
					{' - '}
					{exam.subject}
				</option>
			);
		});
	}

	function filterStudentMarks(studentID) {
		if (initialAssessmentMarkings && initialAssessmentMarkings.studentMarks) {
			const markings = initialAssessmentMarkings.studentMarks;
			return markings.find((marking) => marking.studentID === studentID)
				.markings;
		}
		return 0;
	}

	function updateMarkings(studentID, e) {
		if (
			updatedInfo.markingsFromAssessmentID &&
			updatedInfo.markingsFromAssessmentID.studentMarks
		) {
			const initialMarkings = updatedInfo.markingsFromAssessmentID.studentMarks;
			initialMarkings.find(
				(marking) => marking.studentID === studentID
			).markings = parseInt(e.target.value);
			console.log(initialMarkings);
			// return initialMarkings;
		}
	}

	function studentsList() {
		const students = dataStudent.studentFromClassID;

		return students.map((student) => {
			return (
				<tr key={student._id}>
					<td>{student.studentID}</td>
					<td>
						{student.firstName} {student.lastName}
					</td>
					<td>
						<input
							style={markingStyle}
							type='number'
							defaultValue={filterStudentMarks(student.studentID)}
							onChange={(e) => {
								setUpdatedInfo(updateMarkings(student.studentID, e));
							}}
						/>
					</td>
				</tr>
			);
		});
	}

	function displayCurrentExam() {
		const exams = data.allExams;
		const assessments = data.allAssessments;
		if (selectedData[1].startsWith('A')) {
			return assessments
				.filter((assessment) => {
					return assessment.assessmentID === selectedData[1];
				})
				.map((assessment) => {
					return (
						<div key={assessment.assessmentID} style={infoBar}>
							<span style={{ justifySelf: 'center' }}>
								<strong>Date: </strong>
								{moment(assessment.assessmentDate).format('Do MMMM YY')}
							</span>{' '}
							<span style={{ justifySelf: 'center' }}>
								<strong>Class: </strong>
								{assessment.gradeClass}
							</span>{' '}
							<span style={{ justifySelf: 'center' }}>
								<strong>Subject: </strong>
								{assessment.subject}
							</span>
						</div>
					);
				});
		}
		if (selectedData[1].startsWith('E')) {
			return exams
				.filter((exam) => {
					return exam.examID === selectedData[1];
				})
				.map((exam) => {
					return (
						<div key={exam.examID} style={infoBar}>
							<span style={{ justifySelf: 'center' }}>
								<strong>Date: </strong>
								{moment(exam.examDate).format('Do MMMM YY')}
							</span>{' '}
							<span style={{ justifySelf: 'center' }}>
								<strong>Class: </strong>
								{exam.gradeClass}
							</span>{' '}
							<span style={{ justifySelf: 'center' }}>
								<strong>Subject: </strong>
								{exam.subject}
							</span>
						</div>
					);
				});
		}
	}

	return (
		<StyledMain>
			<h2>Record Markings</h2>
			<FilterHeaderStyled>
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<label>
						<select
							onChange={(e) => {
								setSelectedData(e.target.value.split(','));
							}}
						>
							<option value='undefined'>Select Exam or Assessment</option>
							<optgroup label='Assessment'>{assessmentList()}</optgroup>
							<optgroup label='Exam'>{examList()}</optgroup>
						</select>
					</label>
					<button>SAVE</button>
				</form>
			</FilterHeaderStyled>
			{displayCurrentExam()}
			<StyledTable>
				<table>
					<thead>
						<tr>
							<td>Student ID</td>
							<td>Student Name</td>
							<td>Marks</td>
						</tr>
					</thead>
					<tbody>{studentsList()}</tbody>
				</table>
			</StyledTable>
		</StyledMain>
	);
}

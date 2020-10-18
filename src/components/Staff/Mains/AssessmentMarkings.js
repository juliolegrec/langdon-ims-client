import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import StyledMain from '../styles/MainStyled';
import moment from 'moment';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import TitleStyled from '../styles/TitleStyled';
import DataTableStyled from '../styles/DataTableStyled';

const MainMarkings = styled.div`
	display: grid;
	grid-gap: 10px;
	grid-template-columns: 40% 60%;

	h3 {
		text-align: center;
		margin-bottom: 10px;
	}

	table {
		width: 100%;
		border: 1px solid #bdc3c7;
		border-collapse: collapse;

		thead {
			font-weight: bold;
			text-align: center;
			background: #34495e;
			color: #ecf0f1;

			tr {
				height: 35px;
			}
		}

		tbody {
			text-align: center;

			tr {
				height: 35px;
				border: 1px solid #bdc3c7;

				&:nth-child(even) {
					background: #ecf0f1;
				}
			}
		}
	}
`;

const AssessmentListStyle = styled.div`
	min-height: 50px;
	width: 100%;
	padding: 10px;
	background: #ecf0f1;
	border: 1px solid #bdc3c7;
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: auto auto;
	grid-gap: 10px 0;
	font-size: 16px;
	cursor: pointer;

	&.selectedItem {
		background: #bdc3c7;
	}

	&:hover {
		background: #bdc3c7;
	}

	#date-label,
	#grade-label,
	#subject-label {
		pointer-events: none;
	}

	#date-label,
	#markings-label {
		/* grid-column-start: 1;
		grid-column-end: 3; */
		font-size: 0.85em;
	}

	#grade-label,
	#subject-label {
		font-weight: bold;
		/* font-size: 1.15em; */
	}

	#markings-label {
		background-color: crimson;
		padding: 5px 10px;
		color: white;
		font-weight: 700;
		border-radius: 3px;
	}

	#subject-label,
	#markings-label {
		justify-self: right;
	}
`;

const MarksInput = styled.input`
	text-align: center;
	border: none;
	background: transparent;
	width: 70px;
	padding: 10px 0;

	&:hover {
		background: #bdc3c7;
	}
`;

const SaveBtn = styled.button`
	float: right;
	border-radius: 3px;
	/* padding: 10px; */
	height: 25px;
	font-weight: bold;
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
		allAssessments {
			_id
			assessmentID
			assessmentDate
			gradeClass
			subject
			term
			markings
		}
	}
`;

export default function AssessmentMarkings() {
	const [selectedInfos, setSelectedInfos] = useState(['1', '2']);
	const [updateMarks, setUpdateMarks] = useState([]);
	const [loadingActive, setLoadingActive] = useState(false);

	const pageTitle = 'Assessment Markings';

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	const GET_STUDENTS_FROM_CLASSID = gql`
		{
			studentFromClassID(classID: "${selectedInfos[0]}") {
				_id	
				studentID
				firstName
				lastName
			}
		}
	`;

	const GET_ASSESSMENT_MARKS_FROM_ID = gql`
		{
			markingsFromAssessmentID(assessmentID: "${selectedInfos[1]}") {
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

	const UPDATE_ASSESSMENT_MARKINGS = gql`
		mutation RegisterAssessmentMark($toUpdateMarkings: [StudentMarksInput!]!) {
			registerAssessmentMark(
				assessmentMarkInput: {
					assessmentID: "${selectedInfos[1]}"
					studentMarks: $toUpdateMarkings
				}
			) {
				_id
			}
		}
	`;

	const [updateAssessmentMarks] = useMutation(UPDATE_ASSESSMENT_MARKINGS, {
		onCompleted: () => setLoadingActive(false),
	});

	function handleMarkChange(event, student) {
		let existingStudent = updateMarks.find(
			(element) => element.studentID === student
		);

		if (!existingStudent) {
			let marksObj = {
				studentID: student,
				markings: parseInt(event.target.value),
			};
			setUpdateMarks([...updateMarks, marksObj]);
		} else {
			const objIndex = updateMarks.findIndex(
				(element) => element.studentID === student
			);

			const updatedMarks = {
				studentID: student,
				markings: parseInt(event.target.value),
			};

			updateMarks.splice(objIndex, 1, updatedMarks);
		}
	}

	function listAssessments() {
		if (loading) return <div>Loading...</div>;
		if (error) return <div>Error!</div>;

		const assessments = data.allAssessments;
		return assessments
			.sort((a, b) =>
				a.assessmentDate > b.assessmentDate
					? 1
					: b.assessmentDate > a.assessmentDate
					? -1
					: 0
			)
			.map((assessment) => {
				return (
					<AssessmentListStyle
						key={assessment._id}
						id={assessment.gradeClass + ',' + assessment.assessmentID}
						onClick={(e) => {
							setSelectedInfos(e.target.id.split(','));
							// e.target.classList.toggle('test');
							for (let i = 0; i < e.target.parentNode.childNodes.length; i++) {
								e.target.parentNode.childNodes[i].classList.remove(
									'selectedItem'
								);
							}
							e.target.classList.add('selectedItem');
						}}
					>
						<div id='date-label'>
							{assessment.term} -{' '}
							{moment(assessment.assessmentDate).format('DD MMM YY')}
						</div>
						<div id='markings-label'>Markings: {assessment.markings}</div>
						<div id='grade-label'>Grade: {assessment.gradeClass}</div>
						<div id='subject-label'>{assessment.subject}</div>
					</AssessmentListStyle>
				);
			});
	}

	function markingsInput(student) {
		if (loadingAssessmentMarks) {
			return <span>Loading...</span>;
		}
		if (errorAssessmentMarks) {
			return <span>Error!</span>;
		}

		const assessmentMarks = dataAssessmentMarks.markingsFromAssessmentID;
		if (assessmentMarks && assessmentMarks.studentMarks) {
			const studentMarks = assessmentMarks.studentMarks;

			const marks = studentMarks.find((mark) => mark.studentID === student);
			return (
				<MarksInput
					style={{ textAlign: 'center' }}
					type='number'
					defaultValue={marks && marks.markings ? marks.markings : 0}
					onChange={(e) => handleMarkChange(e, student)}
				/>
			);
		}

		return (
			<MarksInput
				max='25'
				type='number'
				onChange={(e) => handleMarkChange(e, student)}
			/>
		);
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
						{student.firstName} {student.lastName}
					</td>
					<td>{markingsInput(student.studentID)}</td>
				</tr>
			);
		});
	}

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

	function getAssessmentInfo(id) {
		if (loading) {
			return <span>Loading...</span>;
		}
		if (error) {
			return <span>Error</span>;
		}
		const assessments = data.allAssessments;

		const selectedAssessments = assessments.find(
			(element) => element.assessmentID === id
		);
		if (selectedAssessments) {
			return (
				<>
					<p>
						<strong>Assessment Date:</strong>{' '}
						{moment(selectedAssessments.assessmentDate).format('Do MMMM YYYY')}
					</p>
					<p>
						<strong>Grade: </strong>
						{getClassName(selectedInfos[0])}
					</p>
					<p>
						<strong>Subject:</strong> {selectedAssessments.subject}
					</p>
				</>
			);
		}
	}

	function displayTable() {
		return (
			<DataTableStyled>
				<table>
					<thead>
						<tr>
							<th>Student ID</th>
							<th>Student Name</th>
							<th style={{ width: '50px' }}>Marks</th>
						</tr>
					</thead>

					<tbody>{listStudents()}</tbody>
				</table>
			</DataTableStyled>
		);
	}

	return (
		<>
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
				<MainMarkings>
					<div id='right-column'>
						<h3>ASSESSMENTS LIST</h3>
						{listAssessments()}
					</div>
					<div id='left-column'>
						<h3>
							STUDENTS AND MARKS
							<SaveBtn
								type='submit'
								onClick={() => {
									updateAssessmentMarks({
										variables: { toUpdateMarkings: [...updateMarks] },
									});
									setLoadingActive(true);
								}}
								disabled={updateMarks.length === 0 ? 'disabled' : ''}
								style={
									updateMarks.length === 0
										? {}
										: {
												backgroundColor: '#2ecc71',
												border: '1px solid #27ae60',
										  }
								}
							>
								SAVE
							</SaveBtn>
						</h3>
						{displayTable()}
					</div>
				</MainMarkings>
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr 1fr',
						margin: '5mm 0',
					}}
				>
					{getAssessmentInfo(selectedInfos[1])}
				</div>
				{displayTable()}
			</PrintTemplate>
		</>
	);
}

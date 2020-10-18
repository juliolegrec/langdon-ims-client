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
	grid-template-columns: 30% 70%;

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

const ExamsListStyled = styled.div`
	min-height: 50px;
	width: 100%;
	padding: 10px;
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

	#date-label,
	#grade-label,
	#subject-label {
		pointer-events: none;
	}

	#date-label {
		grid-column-start: 1;
		grid-column-end: 3;
		font-size: 0.85em;
	}

	#grade-label,
	#subject-label {
		font-weight: bold;
		font-size: 1.15em;
	}

	#subject-label {
		justify-self: right;
	}
`;

const MarksInput = styled.input`
	text-align: center;
	border: none;
	background: transparent;
	width: auto;
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

		allExams {
			_id
			examID
			examDate
			gradeClass
			subject
			term
		}
	}
`;

export default function ExamMarkings() {
	const [selectedInfos, setSelectedInfos] = useState(['1', '2']);
	const [updateMarks, setUpdateMarks] = useState([]);
	const [loadingActive, setLoadingActive] = useState(false);

	const pageTitle = 'Exam Markings';

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	const GET_STUDENTS_FROM_CLASSID = gql`
		{
			studentFromClassID(classID:"${selectedInfos[0]}") {
				_id	
				studentID
				firstName
				lastName
			}
		}
	`;

	const GET_EXAM_MARKS_FROM_ID = gql`
		{
			markingsFromExamID(examID: "${selectedInfos[1]}") {
				_id
				examID
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
		loading: loadingExamMarks,
		error: errorExamMarks,
		data: dataExamMarks,
	} = useQuery(GET_EXAM_MARKS_FROM_ID);

	const UPDATE_EXAM_MARKINGS = gql`
		mutation RegisterExamMark($toUpdateMarkings: [StudentMarksInput!]!) {
			registerExamMark(
				examMarkInput: {
					examID: "${selectedInfos[1]}"
					studentMarks: $toUpdateMarkings
				}
			) {
				_id
			}
		}
	`;

	const [updateExamMarks] = useMutation(UPDATE_EXAM_MARKINGS, {
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

	function listExams() {
		if (loading) return <option value='loading'>Loading...</option>;
		if (error) return <option value='error'>Error!</option>;

		const exams = data.allExams;
		return exams
			.sort((a, b) =>
				a.examDate > b.examDate ? 1 : b.examDate > a.examDate ? -1 : 0
			)
			.map((exam) => {
				return (
					<ExamsListStyled
						key={exam._id}
						id={exam.gradeClass + ',' + exam.examID}
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
							{exam.term} - {moment(exam.examDate).format('DD MMM YY')}
						</div>
						<div id='grade-label'>Grade: {exam.gradeClass}</div>
						<div id='subject-label'>{exam.subject}</div>
					</ExamsListStyled>
				);
			});
	}

	function markingsInput(student) {
		if (loadingExamMarks) {
			return <span>Loading...</span>;
		}
		if (errorExamMarks) {
			return <span>Error!</span>;
		}

		const examMarks = dataExamMarks.markingsFromExamID;
		if (examMarks && examMarks.studentMarks) {
			const studentMarks = examMarks.studentMarks;
			// setUpdateMarks(studentMarks);

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

	function getExamInfo(id) {
		if (loading) {
			return <span>Loading...</span>;
		}
		if (error) {
			return <span>Error</span>;
		}
		const exams = data.allExams;

		const selectedExams = exams.find((element) => element.examID === id);
		if (selectedExams) {
			return (
				<>
					<p>
						<strong>Exam Date:</strong>{' '}
						{moment(selectedExams.examDate).format('Do MMMM YYYY')}
					</p>
					<p>
						<strong>Grade: </strong>
						{getClassName(selectedInfos[0])}
					</p>
					<p>
						<strong>Subject:</strong> {selectedExams.subject}
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
							<th>Marks</th>
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
						<h3>EXAMS LIST</h3>
						{listExams()}
					</div>
					<div id='left-column'>
						<h3>
							STUDENTS AND MARKS
							<SaveBtn
								onClick={() => {
									updateExamMarks({
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
					{getExamInfo(selectedInfos[1])}
				</div>
				{displayTable()}
			</PrintTemplate>
		</>
	);
}

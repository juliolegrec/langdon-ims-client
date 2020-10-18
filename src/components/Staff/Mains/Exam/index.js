import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import DataTableStyled from '../../styles/DataTableStyled';
import ActionBtnStyled from '../../styles/ActionBtnStyled';
import styled from 'styled-components';
import moment from 'moment';
import { uniquefy } from '../../../../helpers';
import Modal from '@material-ui/core/Modal';
import PrintTemplate from 'react-print';
import PrintHeader from '../../../PrintHeader';
import TitleStyled from '../../styles/TitleStyled';

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
			margin: 0 10px;

			select {
				width: 100%;
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

const StyledModal = styled.div`
	width: 30%;
	background: #ffffff;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-25%, -50%);

	h3 {
		margin-top: 15px;
		text-align: center;
	}

	.btn {
		width: 100%;
		margin: 30px 0;
		display: flex;
		justify-content: center;

		button {
			margin: 0 15px;
			width: 150px;
			height: 40px;
			background-color: #2ecc71;
			color: white;
			font-weight: bold;
			font-size: 1rem;
			cursor: pointer;
			border: 1px solid transparent;
			border-radius: 0.25rem;

			&:nth-child(1) {
				background-color: #e74c3c;
			}
		}
	}
`;

const GET_ALL_EXAMS = gql`
	{
		allExams {
			_id
			examID
			examDate
			startTime
			duration
			subject
			gradeClass
			markings
			term
		}
	}
`;

export default function Exams(props) {
	const { loading: loadingExam, error: errorExam, data: dataExam } = useQuery(
		GET_ALL_EXAMS
	);

	const [selectedTerm, setselectedTerm] = useState();
	const [selectedClass, setSelectedClass] = useState();
	const [selectedSubject, setSelectedSubject] = useState();
	const [selectedRowID, setselectedRowID] = useState();
	const [open, setOpen] = useState(false);

	const pageTitle = 'Final Exam Schedule';

	const DELETE_EXAM = gql`
    mutation {
      deleteExam(_id: "${selectedRowID}"){
        _id
      }
    }
	`;

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const resetFilters = () => {
		setselectedTerm();
		setSelectedClass();
		setSelectedSubject();
	}

	const [deleteExam] = useMutation(DELETE_EXAM);

	function newExam() {
		props.history.push(`/staff/finalexams/register-exam`);
	}

	function filterTerm() {
		if (loadingExam) {
			return <option value='loading'>Loading...</option>;
		}

		if (errorExam) {
			return <option value='error'>Error!</option>;
		}

		const exams = dataExam.allExams;

		return uniquefy(exams, 'term')
			.sort()
			.map((term) => {
				return (
					<option key={term} value={term}>
						{term}
					</option>
				);
			});
	}

	function filterClass() {
		if (loadingExam) {
			return <option value='loading'>Loading...</option>;
		}

		if (errorExam) {
			return <option value='error'>Error!</option>;
		}

		const exams = dataExam.allExams;

		const filteredClass = exams.filter((exam) => exam.term === selectedTerm);

		return uniquefy(filteredClass, 'gradeClass')
			.sort()
			.map((sClass) => {
				return (
					<option key={sClass} value={sClass}>
						{sClass}
					</option>
				);
			});
	}

	function filterSubject() {
		if (loadingExam) {
			return <option value='loading'>Loading...</option>;
		}

		if (errorExam) {
			return <option value='error'>Error!</option>;
		}

		const exams = dataExam.allExams;

		return exams
			.filter((exam) => {
				return exam.gradeClass === selectedClass && exam.term === selectedTerm;
			})
			.map((exam) => {
				return (
					<option key={exam.subject} value={exam.subject}>
						{exam.subject}
					</option>
				);
			});
	}

	function displayExams() {
		if (loadingExam) {
			return (
				<tr value='loading'>
					<td>Loading...</td>
				</tr>
			);
		}

		if (errorExam) {
			return (
				<tr value='error'>
					<td>Error!</td>
				</tr>
			);
		}

		const exams = dataExam.allExams;

		let filteredExam = exams;

		if (
			selectedTerm !== undefined &&
			selectedClass === undefined &&
			selectedSubject === undefined
		) {
			filteredExam = exams.filter((exam) => {
				return exam.term === selectedTerm;
			});
		}

		if (
			selectedTerm !== undefined &&
			selectedClass !== undefined &&
			selectedSubject === undefined
		) {
			filteredExam = exams.filter((exam) => {
				return exam.term === selectedTerm && exam.gradeClass === selectedClass;
			});
		}
		if (
			selectedTerm !== undefined &&
			selectedClass !== undefined &&
			selectedSubject !== undefined
		) {
			filteredExam = exams.filter((exam) => {
				return (
					exam.term === selectedTerm &&
					exam.gradeClass === selectedClass &&
					exam.subject === selectedSubject
				);
			});
		}

		console.log(filteredExam);

		return filteredExam
			.sort((a, b) => {
				return a.examDate < b.examDate ? -1 : 1;
			})
			.map((exam) => {
				return (
					<tr id={exam._id} key={exam._id}>
						<td>{exam.term}</td>
						<td>{moment(exam.examDate).format('Do MMMM YYYY')}</td>
						<td>{exam.startTime}</td>
						<td>{exam.gradeClass}</td>
						<td>{exam.subject}</td>
						<td>{exam.markings}</td>
						<ActionBtnStyled id='react-no-print'>
							<button
								id='edit-btn'
								onClick={(e) => {
									props.history.push(
										`/staff/finalexams/update-exam/${e.target.parentNode.parentNode.getAttribute(
											'id'
										)}`
									);
								}}
							>
								EDIT
							</button>
							<button
								id='delete-btn'
								onClick={(e) => {
									setselectedRowID(
										e.target.parentNode.parentNode.getAttribute('id')
									);
									handleOpen();
								}}
							>
								DELETE
							</button>
						</ActionBtnStyled>
					</tr>
				);
			});
	}

	function displayTable() {
		return (
			<DataTableStyled style={{ marginTop: '10px' }}>
				<table>
					<thead>
						<tr>
							<th>Term</th>
							<th>Date</th>
							<th>Start Time</th>
							<th>Class</th>
							<th>Subject</th>
							<th>Marking</th>
							<th id='react-no-print'>Action</th>
						</tr>
					</thead>
					<tbody>{displayExams()}</tbody>
				</table>
			</DataTableStyled>
		);
	}

	return (
		<>
			<StyledMain id='react-no-print'>
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				<FilterHeaderStyled>
					<form onSubmit={e => e.preventDefault()}>
						<label>
							<select onChange={(e) => setselectedTerm(e.target.value)}>
								<option value='undefined'>Select Term...</option>
								{filterTerm()}
							</select>
						</label>
						<label>
							<select onChange={(e) => setSelectedClass(e.target.value)}>
								<option value='undefined'>Select Class...</option>
								{filterClass()}
							</select>
						</label>
						<label>
							<select onChange={(e) => setSelectedSubject(e.target.value)}>
								<option value='undefined'>Select Subject...</option>
								{filterSubject()}
							</select>
						</label>
						<button
							style={{
								background: "transparent",
								color: "#106BD6",
								fontWeight: "normal",
								fontSize: "0.85rem"
							}}
							onClick={resetFilters}
						>
							Clear Filters
						</button>
						<button onClick={() => newExam()}>+ Add</button>
					</form>
				</FilterHeaderStyled>
				{displayTable()}

				<Modal open={open} onClose={handleClose}>
					<StyledModal>
						<h3>Are you sure you want to delete this exam?</h3>
						<div className='btn'>
							<button
								onClick={() => {
									deleteExam();
									window.location.reload(true);
									handleClose();
									console.log(selectedRowID);
								}}
							>
								Yes
							</button>
							<button onClick={handleClose}>No</button>
						</div>
					</StyledModal>
				</Modal>
			</StyledMain>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				{displayTable()}
			</PrintTemplate>
		</>
	);
}

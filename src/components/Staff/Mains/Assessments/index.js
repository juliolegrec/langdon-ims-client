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

const GET_ALL_ASSESSMENTS = gql`
	{
		allAssessments {
			_id
			assessmentID
			gradeClass
			term
			assessmentDate
			period
			markings
			subject
			order
		}
	}
`;

export default function Assessments(props) {
	const {
		loading: loadingAssessment,
		error: errorAssessment,
		data: dataAssessment,
	} = useQuery(GET_ALL_ASSESSMENTS);

	const [selectedTerm, setselectedTerm] = useState();
	const [selectedClass, setSelectedClass] = useState();
	const [selectedSubject, setSelectedSubject] = useState();
	const [selectedRowID, setselectedRowID] = useState();
	const [open, setOpen] = useState(false);

	const pageTitle = 'Assessment Schedule';

	const DELETE_ASSESSMENT = gql`
    mutation {
      deleteAssessment(_id: "${selectedRowID}"){
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

	const [deleteAssessment] = useMutation(DELETE_ASSESSMENT);

	function newAssessment() {
		props.history.push(`/staff/assessments/register-assessment`);
	}

	function filterTerm() {
		if (loadingAssessment) {
			return <option value="loading">Loading...</option>;
		}

		if (errorAssessment) {
			return <option value="error">Error!</option>;
		}

		const assessments = dataAssessment.allAssessments;

		return uniquefy(assessments, 'term')
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
		if (loadingAssessment) {
			return <option value="loading">Loading...</option>;
		}

		if (errorAssessment) {
			return <option value="error">Error!</option>;
		}

		const assessments = dataAssessment.allAssessments;

		const filteredClass = assessments.filter(
			(assessment) => assessment.term === selectedTerm
		);

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
		if (loadingAssessment) {
			return <option value="loading">Loading...</option>;
		}

		if (errorAssessment) {
			return <option value="error">Error!</option>;
		}

		const assessments = dataAssessment.allAssessments;

		return assessments
			.filter((assessment) => {
				return (
					assessment.gradeClass === selectedClass &&
					assessment.term === selectedTerm
				);
			})
			.map((assessment) => {
				return (
					<option key={assessment.subject} value={assessment.subject}>
						{assessment.subject}
					</option>
				);
			});
	}

	function displayAssessments() {
		if (loadingAssessment) {
			return (
				<tr value="loading">
					<td>Loading...</td>
				</tr>
			);
		}

		if (errorAssessment) {
			return (
				<tr value="error">
					<td>Error!</td>
				</tr>
			);
		}

		const assessments = dataAssessment.allAssessments;

		let filteredAssessment = assessments;

		if (
			selectedTerm !== undefined &&
			selectedClass === undefined &&
			selectedSubject === undefined
		) {
			filteredAssessment = assessments.filter((assessment) => {
				return assessment.term === selectedTerm;
			});
		}

		if (
			selectedTerm !== undefined &&
			selectedClass !== undefined &&
			selectedSubject === undefined
		) {
			filteredAssessment = assessments.filter((assessment) => {
				return (
					assessment.term === selectedTerm &&
					assessment.gradeClass === selectedClass
				);
			});
		}
		if (
			selectedTerm !== undefined &&
			selectedClass !== undefined &&
			selectedSubject !== undefined
		) {
			filteredAssessment = assessments.filter((assessment) => {
				return (
					assessment.term === selectedTerm &&
					assessment.gradeClass === selectedClass &&
					assessment.subject === selectedSubject
				);
			});
		}

		console.log(filteredAssessment);

		return filteredAssessment
			.sort((a, b) => {
				return a.assessmentDate < b.assessmentDate ? -1 : 1;
			})
			.map((assessment) => {
				function orderSuffix(order) {
					switch (order) {
						case 1:
							return <sup>st</sup>;
						case 2:
							return <sup>nd</sup>;
						case 3:
							return <sup>rd</sup>;
						default:
							return <sup>th</sup>;
					}
				}

				return (
					<tr id={assessment._id} key={assessment._id}>
						<td>
							{assessment.term} - {assessment.order}
							{''}
							{orderSuffix(assessment.order)} assessment
						</td>
						<td>{moment(assessment.assessmentDate).format('Do MMMM YYYY')}</td>
						<td>{assessment.gradeClass}</td>
						<td>{assessment.subject}</td>
						<td>{assessment.period}</td>
						<td>{assessment.markings}</td>
						<ActionBtnStyled id="react-no-print">
							<button
								onClick={(e) => {
									props.history.push(
										`/staff/assessments/update-assessment/${e.target.parentNode.parentNode.getAttribute(
											'id'
										)}`
									);
								}}
							>
								EDIT
							</button>

							<button
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
							<th>Class</th>
							<th>Subject</th>
							<th>Period</th>
							<th>Marking</th>
							<th id="react-no-print">Action</th>
						</tr>
					</thead>
					<tbody>{displayAssessments()}</tbody>
				</table>
			</DataTableStyled>
		);
	}

	return (
		<>
			<StyledMain id="react-no-print">
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				<FilterHeaderStyled>
					<form>
						<label>
							<select onChange={(e) => setselectedTerm(e.target.value)}>
								<option value="undefined">Select Term...</option>
								{filterTerm()}
							</select>
						</label>
						<label>
							<select onChange={(e) => setSelectedClass(e.target.value)}>
								<option value="undefined">Select Class...</option>
								{filterClass()}
							</select>
						</label>

						<label>
							<select onChange={(e) => setSelectedSubject(e.target.value)}>
								<option value="undefined">Select Subject...</option>
								{filterSubject()}
							</select>
						</label>
						<button onClick={() => newAssessment()}>+ Add</button>
					</form>
				</FilterHeaderStyled>
				{displayTable()}

				<Modal open={open} onClose={handleClose}>
					<StyledModal>
						<h3>Are you sure you want to delete this class?</h3>
						<div className="btn">
							<button
								onClick={() => {
									deleteAssessment();
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

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import DataTableStyled from '../../styles/DataTableStyled';
import styled from 'styled-components';
import ActionBtnStyled from '../../styles/ActionBtnStyled';
import PrintTemplate from 'react-print';
import PrintHeader from '../../../PrintHeader';
import TitleStyled from '../../styles/TitleStyled';
import Modal from '@material-ui/core/Modal';
import StyledModal from '../../../styles/StyledModal';

const StyledSubjectForm = styled.div`
	box-sizing: border-box;
	width: 100%;
	background: #f5f5f5;
	padding: 10px;

	form {
		background: #fff;
		padding: 10px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr auto;
		grid-gap: 10px;
		grid-row-gap: 15px;

		label {
			width: 100%;
			flex-grow: 2;

			input,
			select {
				display: inline-block;
				width: 100%;
				margin-top: 10px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;
			}

			&:nth-child(2) {
				grid-row-start: 1;
				grid-row-end: 3;
				grid-column-start: 2;
				grid-column-end: 3;
			}
			input {
				height: 35px;
			}
		}

		label > span {
			font-size: 0.75em;
		}

		button {
			width: 150px;
			height: 35px;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;
			align-self: center;
		}
	}
`;

function SubjectsView(props) {
	const [newSubjectInfo, setNewSubjectInfo] = useState({});
	const [selectedRowID, setSelectedRowID] = useState('');
	const [openDelete, setOpenDelete] = useState(false);

	const pageTitle = 'Subjects View';

	const GET_ALL_TEACHERS = gql`
		{
			allTeachers {
				_id
				teacherID
				firstName
				lastName
			}
		}
	`;

	const GET_ALL_SUBJECTS = gql`
		{
			allSubjects {
				_id
				subjectID
				subjectName
				teacherID
			}
		}
	`;

	const DELETE_SUBJECT = gql`
		mutation {
			deleteSubject(_id: "${selectedRowID}"){
				_id
			}
		}
	`;

	const handleOpenDelete = () => {
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	const {
		loading: loading_teachers,
		error: error_teachers,
		data: data_teachers,
	} = useQuery(GET_ALL_TEACHERS);

	const {
		loading: loading_subjects,
		error: error_subjects,
		data: data_subjects,
	} = useQuery(GET_ALL_SUBJECTS);

	const [deleteSubject] = useMutation(DELETE_SUBJECT, {
		onCompleted: () => {
			window.location.reload();
		},
	});

	const CREATE_SUBJECT = gql`
		mutation CreateSubject($teacherID: [String]) {
			createSubject(
				subjectInput: {
					subjectName: "${newSubjectInfo.subjectName}"
					teacherID: $teacherID
				}
			) {
				_id
				subjectID
			}
		}
	`;

	const [createSubject] = useMutation(CREATE_SUBJECT, {
		onCompleted: () => {
			window.location.reload();
		},
	});

	function displayTeacherList() {
		if (loading_teachers) return <option>Loading...</option>;
		if (error_teachers) return <option>Error!</option>;

		const teachers = data_teachers.allTeachers;

		return teachers.map((teacher) => {
			return (
				<option key={teacher._id} value={teacher.teacherID}>
					{teacher.firstName} {teacher.lastName}
				</option>
			);
		});
	}

	function displaySubjectsList() {
		if (loading_subjects)
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);

		if (error_subjects)
			return (
				<tr>
					<td>Error!</td>
				</tr>
			);

		const subjects = data_subjects.allSubjects;

		return subjects.map((subject) => {
			function displayTeacherName(subject) {
				if (loading_teachers) return <p>Loading...</p>;
				if (error_teachers) return <p>Error!</p>;
				const teachers = data_teachers.allTeachers;

				let selectedTeachers = [];

				for (let i = 0; i < subject.teacherID.length; i++) {
					selectedTeachers.push(
						teachers.find(
							(teacher) => teacher.teacherID === subject.teacherID[i]
						)
					);
				}
				return selectedTeachers.map((teacher) => {
					return (
						<p key={teacher._id}>
							{teacher.firstName} {teacher.lastName}
						</p>
					);
				});
			}

			return (
				<tr id={subject._id} key={subject._id}>
					<td>{subject.subjectID}</td>
					<td>{subject.subjectName}</td>
					<td>{displayTeacherName(subject)}</td>
					<ActionBtnStyled id='react-no-print'>
						<button
							onClick={(e) => {
								props.history.push(
									`/staff/subjects/update-subject/${e.target.parentNode.parentNode.getAttribute(
										'id'
									)}`
								);
								// setSelectedRowID(
								// 	e.target.parentNode.parentNode.getAttribute('id')
								// );
								// handleOpenEdit();
							}}
						>
							EDIT
						</button>
						<button
							onClick={(e) => {
								setSelectedRowID(
									e.target.parentNode.parentNode.getAttribute('id')
								);
								handleOpenDelete();
								console.log(e.target.parentNode.parentNode);
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
							<th>Subject ID</th>
							<th>Subject Name</th>
							<th>Teacher(s)</th>
							<th id='react-no-print'>Actions</th>
						</tr>
					</thead>
					<tbody>{displaySubjectsList()}</tbody>
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
				<StyledSubjectForm>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							createSubject({
								variables: { teacherID: newSubjectInfo.teacherID },
							});
						}}
					>
						<label>
							Subject Name:
							<input
								required
								type='text'
								onChange={(e) => {
									setNewSubjectInfo({
										...newSubjectInfo,
										subjectName: e.target.value,
									});
								}}
							/>
						</label>
						<label>
							Teacher<span>(Control + click to select multiples)</span>:
							<select
								onChange={(e) => {
									let selectedOpts = [...e.target.options]
										.filter((x) => x.selected)
										.map((opt) => opt.value);

									setNewSubjectInfo({
										...newSubjectInfo,
										teacherID: selectedOpts,
									});
								}}
								multiple
								size='3'
							>
								{displayTeacherList()}
							</select>
						</label>
						<button>+ Add Subject</button>
					</form>
				</StyledSubjectForm>
				{displayTable()}
				<Modal open={openDelete} onClose={handleCloseDelete}>
					<StyledModal>
						<h3>Are you sure you want to delete this subject?</h3>
						<div className='btn'>
							<button
								onClick={() => {
									deleteSubject();
									window.location.reload(true);
									handleCloseDelete();
									console.log(selectedRowID);
								}}
							>
								Yes
							</button>
							<button onClick={handleCloseDelete}>No</button>
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

export default SubjectsView;

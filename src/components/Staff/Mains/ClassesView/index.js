import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import PrintTemplate from 'react-print';
import PrintHeader from '../../../PrintHeader';
import TitleStyled from '../../styles/TitleStyled';
import DataTableStyled from '../../styles/DataTableStyled';
import ActionBtnStyled from '../../styles/ActionBtnStyled';
import StyledModal from '../../../styles/StyledModal';

const StyledAddButton = styled.button`
	width: 150px;
	height: 40px;
	background-color: #0068d9;
	color: white;
	font-weight: bold;
	font-size: 1rem;
	cursor: pointer;
	border: 1px solid transparent;
	border-radius: 0.25rem;
	flex-grow: 1;
	position: absolute;
	top: 10px;
	right: 10px;
`;

function ClassesView(props) {
	const [open, setOpen] = useState(false);
	const [selectedRowID, setSelectedRowID] = useState('');

	const pageTitle = 'Classes List';

	const GET_ALL_CLASSES = gql`
		{
			allClasses {
				_id
				classID
				className
				grade
				capacity
				numberOfStudents
				formTeacher {
					_id
					firstName
					lastName
				}
			}
		}
	`;

	const DELETE_CLASS = gql`
    mutation {
      deleteGradeClass(_id: "${selectedRowID}"){
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

	const { loading, error, data } = useQuery(GET_ALL_CLASSES);

	const [deleteGradeClass] = useMutation(DELETE_CLASS);

	function displayClasses() {
		if (loading)
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);

		if (error)
			return (
				<tr>
					<td>Error!</td>
				</tr>
			);

		const classes = data.allClasses;

		return classes
			.sort((a, b) =>
				parseInt(a.grade) > parseInt(b.grade)
					? 1
					: parseInt(b.grade) > parseInt(a.grade)
					? -1
					: 0
			)
			.map((gradeClass) => {
				let teacherFirstName =
					gradeClass.formTeacher && gradeClass.formTeacher.firstName
						? gradeClass.formTeacher.firstName
						: '';
				let teacherLastName =
					gradeClass.formTeacher && gradeClass.formTeacher.lastName
						? gradeClass.formTeacher.lastName
						: '';
				return (
					<tr id={gradeClass._id} key={gradeClass._id}>
						<td>{gradeClass.classID}</td>
						<td>{gradeClass.grade}</td>
						<td>{gradeClass.className}</td>
						{/* <td>{gradeClass.numberOfStudents}</td> */}
						<td>{gradeClass.capacity}</td>
						<td>{`${teacherFirstName} ${teacherLastName}`}</td>
						<ActionBtnStyled id="react-no-print">
							<button
								id="edit-btn"
								onClick={(e) => {
									props.history.push(
										`/staff/classes/update-class/${e.target.parentNode.parentNode.getAttribute(
											'id'
										)}`
									);
								}}
							>
								EDIT
							</button>

							<button
								id="delete-btn"
								onClick={(e) => {
									setSelectedRowID(
										e.target.parentNode.parentNode.parentNode.getAttribute('id')
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
			<DataTableStyled style={{ marginTop: '20px' }}>
				<table>
					<thead>
						<tr>
							<th>Class ID</th>
							<th>Grade</th>
							<th>Class Name</th>
							{/* <th>Number of Students</th> */}
							<th>Capacity</th>
							<th>Teacher in Charge</th>
							<th id="react-no-print">Actions</th>
						</tr>
					</thead>
					<tbody>{displayClasses()}</tbody>
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
				<StyledAddButton
					onClick={() => props.history.push('/staff/classes/new-class')}
				>
					+ Add Class
				</StyledAddButton>
				{displayTable()}

				<Modal open={open} onClose={handleClose}>
					<StyledModal>
						<h3>Are you sure you want to delete this class?</h3>
						<div className="btn">
							<button
								onClick={() => {
									deleteGradeClass();
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

export default ClassesView;

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
// import DeleteIcon from '@material-ui/icons/Delete';
import ActionBtnStyled from '../styles/ActionBtnStyled';
import DataTableStyled from '../styles/DataTableStyled';
import Modal from '@material-ui/core/Modal';
import StyledModal from '../../styles/StyledModal';
import moment from 'moment';

const SchoolCalendarMainStyled = styled.main`
	max-width: 800px;
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;

	h2 {
		margin-bottom: 10px;
	}

	form {
		max-width: 100%;
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-gap: 10px;

		label {
			/* margin-bottom: 30px; */

			input,
			select {
				width: 100%;
				height: 30px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				margin-top: 10px;
				padding-left: 10px;
			}
		}

		button {
			width: 125px;
			height: 35px;
			grid-column-start: 1;
			grid-column-end: 3;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;
		}
	}
	.term-table {
		margin-top: 30px;

		.MuiSvgIcon-root {
			cursor: pointer;
		}
	}
`;

const LoadingImage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: white;
	display: flex;
	justify-content: center;
	opacity: 0.75;

	img {
		margin-top: 75px;
	}
`;

function SchoolCalendar(props) {
	const [schoolTerm, setSchoolTerm] = useState({});
	const [selectedRowID, setSelectedRowID] = useState();
	const [selectedData, setSelectedData] = useState({
		termName: '',
		beginDate: '',
		endDate: '',
	});
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const [loadingActive, setLoadingActive] = useState(false);

	const CREATE_SCHOOL_TERM = gql`
		mutation {
			createSchoolTerm(
				schoolTermInput: {
					termName: "${schoolTerm.termName}"
					beginDate: "${schoolTerm.beginDate}"
					endDate: "${schoolTerm.endDate}"
				}
			) {
				_id
			}
		}
	`;

	const [createSchoolTerm] = useMutation(CREATE_SCHOOL_TERM, {
		onCompleted: () => {
			setLoadingActive(false);
			window.location.reload();
		},
	});

	const GET_ALL_SCHOOLTERMS = gql`
		{
			allSchoolTerms {
				_id
				termName
				beginDate
				endDate
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_SCHOOLTERMS);

	function displaySchoolTerms() {
		if (loading)
			return (
				<tr>
					<td>Loading...</td>
				</tr>
			);
		if (error)
			return (
				<tr>
					<td>{error.message}</td>
				</tr>
			);

		const allSchoolTerms = data.allSchoolTerms;

		return allSchoolTerms.map((schoolTerm) => {
			return (
				<tr id={schoolTerm._id} key={schoolTerm._id}>
					<td>{schoolTerm.termName}</td>
					<td data-begindate={schoolTerm.beginDate}>
						{moment(schoolTerm.beginDate).format('Do MMMM YYYY')}
					</td>
					<td data-enddate={schoolTerm.endDate}>
						{moment(schoolTerm.endDate).format('Do MMMM YYYY')}
					</td>
					<ActionBtnStyled id='react-no-print'>
						<button
							onClick={(e) => {
								setSelectedRowID(
									e.target.parentNode.parentNode.getAttribute('id')
								);
								setSelectedData({
									termName:
										e.target.parentNode.parentNode.children[0].innerText,
									beginDate:
										e.target.parentNode.parentNode.children[1].dataset
											.begindate,
									endDate:
										e.target.parentNode.parentNode.children[2].dataset.enddate,
								});
								handleOpenEdit();
							}}
						>
							EDIT
						</button>
						<button
							onClick={(e) => {
								setSelectedRowID(
									e.target.parentNode.parentNode.getAttribute('id')
								);
								console.log(selectedRowID);
								handleOpenDelete();
							}}
						>
							DELETE
						</button>
					</ActionBtnStyled>
				</tr>
			);
		});
	}

	const UPDATE_SCHOOL_TERM = gql`
		mutation {
			updateSchoolTerm(
				_id: "${selectedRowID}",
				termName: "${selectedData.termName}",
				beginDate: "${selectedData.beginDate}",
				endDate: "${selectedData.endDate}",
			) {
				_id
			}
		}
	`;

	const [updateSchoolTerm] = useMutation(UPDATE_SCHOOL_TERM, {
		onCompleted: () => {
			// setLoadingActive(false);
			// setTimeout(() => {
				window.location.reload();
			// }, 3000);
		},
	});

	const DELETE_SCHOOL_TERM = gql`
		mutation DeleteSchoolTerm($_id: ID!) {
			deleteSchoolTerm(_id: $_id) {
				termName
			}
		}
	`;

	const [deleteSchoolTerm] = useMutation(DELETE_SCHOOL_TERM);

	const handleOpenDelete = () => {
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	const handleOpenEdit = () => {
		setOpenEdit(true);
	};

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	return (
		<SchoolCalendarMainStyled>
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
			<h2>School Calendar</h2>
			<section>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createSchoolTerm();
						setLoadingActive(true);
					}}
				>
					<label>
						Term Name:
						<input
							type='text'
							value={schoolTerm.termName || ''}
							onChange={(e) =>
								setSchoolTerm({ ...schoolTerm, termName: e.target.value })
							}
						/>
					</label>
					<label>
						From:
						<input
							type='date'
							value={schoolTerm.beginDate || ''}
							onChange={(e) =>
								setSchoolTerm({ ...schoolTerm, beginDate: e.target.value })
							}
						/>
					</label>
					<label>
						To:
						<input
							type='date'
							value={schoolTerm.endDate || ''}
							onChange={(e) =>
								setSchoolTerm({ ...schoolTerm, endDate: e.target.value })
							}
						/>
					</label>
					<button type='submit'>+ Add Term</button>
				</form>
			</section>
			<section className='term-table'>
				<DataTableStyled>
					<table>
						<thead>
							<tr>
								<th>Term Name</th>
								<th>Begin Date</th>
								<th>End Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>{displaySchoolTerms()}</tbody>
					</table>
				</DataTableStyled>
			</section>
			<Modal open={openDelete} onClose={handleCloseDelete}>
				<StyledModal>
					<h3>Are you sure you want to delete this term?</h3>
					<div className='btn'>
						<button
							onClick={(e) => {
								deleteSchoolTerm({
									variables: {
										_id: selectedRowID,
									},
								});
								window.location.reload(true);
								handleCloseDelete();
							}}
						>
							Yes
						</button>
						<button onClick={handleCloseDelete}>No</button>
					</div>
				</StyledModal>
			</Modal>
			<Modal open={openEdit} onClose={handleCloseEdit}>
				<StyledModal>
					<h3>Edit Term Info</h3>
					<form>
						<label>
							<span>Term Name:</span>
							<input
								defaultValue={selectedData.termName}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										termName: e.target.value,
									});
								}}
								type='text'
							/>
						</label>
						<label>
							<span>Begin Date:</span>
							<input
								type='date'
								defaultValue={moment(selectedData.beginDate).format(
									'YYYY-MM-DD'
								)}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										beginDate: e.target.value,
									});
								}}
							/>
						</label>
						<label>
							<span>End date:</span>
							<input
								type='date'
								defaultValue={moment(selectedData.endDate).format('YYYY-MM-DD')}
								onChange={(e) => {
									setSelectedData({ ...selectedData, endDate: e.target.value });
								}}
							/>
						</label>
					</form>

					<div className='btn'>
						<button
							style={{ background: '#2ecc71' }}
							onClick={() => {
								updateSchoolTerm();
								// window.location.reload(true);
								handleCloseEdit();
								setLoadingActive(true);
								console.log(selectedRowID);
							}}
						>
							SAVE
						</button>
						<button
							style={{ background: '#e74c3c' }}
							onClick={() => {
								handleCloseEdit();
							}}
						>
							CANCEL
						</button>
					</div>
				</StyledModal>
			</Modal>
		</SchoolCalendarMainStyled>
	);
}

export default SchoolCalendar;

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import ActionBtnStyled from '../styles/ActionBtnStyled';
import Modal from '@material-ui/core/Modal';
import StyledModal from '../../styles/StyledModal';
import StyledMain from '../styles/MainStyled';
import DataTableStyled from '../styles/DataTableStyled';

const FormStyled = styled.section`
	form {
		max-width: 100%;
		display: grid;
		grid-template-columns: repeat(4, auto);
		grid-gap: 10px;

		label {

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

function ClassHours() {
	const [classHour, setClassHour] = useState({ type: 'TEACHING' });

	const [selectedRowID, setSelectedRowID] = useState('');
	const [selectedData, setSelectedData] = useState({
		hourName: '',
		beginTime: '',
		endTime: '',
		type: '',
	});
	console.log(selectedRowID);
	console.log(selectedData);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [loadingActive, setLoadingActive] = useState(false);

	const CREATE_CLASS_HOUR = gql`
		mutation {
			createClassHour(
				classHourInput: {
					hourName: "${classHour.hourName}"
					beginTime: "${classHour.beginTime}"
					endTime: "${classHour.endTime}"
					type: ${classHour.type}
				}
			) {
				_id
				hourName
			}
		}
	`;

	const [createClassHour] = useMutation(CREATE_CLASS_HOUR);

	const GET_ALL_CLASSHOURS = gql`
		{
			allClassHours {
				_id
				hourName
				beginTime
				endTime
				type
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_CLASSHOURS);
	// if (loading) return <p>Loading...</p>;
	// if (error) return <p>{error.message}</p>;

	// console.log(data.allClassHours);

	function displayClassHours() {
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

		const allClassHours = data.allClassHours;

		return allClassHours.map((classHour) => {
			return (
				<tr id={classHour._id} key={classHour._id}>
					<td>{classHour.hourName}</td>
					<td>{classHour.beginTime}</td>
					<td>{classHour.endTime}</td>
					<td>{classHour.type}</td>
					{/* <DeleteIcon
							onClick={(e) => {
								deleteClassHour({
									variables: {
										_id: e.target.parentNode.parentNode.parentNode.getAttribute(
											'id'
										),
									},
								});
								window.location.reload();
							}}
						/> */}
					<ActionBtnStyled id='react-no-print'>
						<button
							onClick={(e) => {
								setSelectedRowID(
									e.target.parentNode.parentNode.getAttribute('id')
								);
								setSelectedData({
									hourName:
										e.target.parentNode.parentNode.children[0].innerText,
									beginTime:
										e.target.parentNode.parentNode.children[1].innerText,
									endTime: e.target.parentNode.parentNode.children[2].innerText,
									type: e.target.parentNode.parentNode.children[3].innerText,
								});
								console.log(e.target.parentNode.parentNode.children);
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

	const UPDATE_CLASS_HOUR = gql`
		mutation ($type: ClassHourType) {
			updateClassHour(
				_id: "${selectedRowID}"
				hourName: "${selectedData.hourName}"
				beginTime: "${selectedData.beginTime}"
				endTime: "${selectedData.endTime}"
				type: $type
			) {
				_id
			}
		}
	`;

	const [updateClassHour] = useMutation(UPDATE_CLASS_HOUR, {
		onCompleted: () => {
			window.location.reload();
		},
	});

	const DELETE_CLASS_HOUR = gql`
		mutation DeleteClassHour($_id: ID!) {
			deleteClassHour(_id: $_id) {
				hourName
			}
		}
	`;

	const [deleteClassHour] = useMutation(DELETE_CLASS_HOUR);

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
		<StyledMain>
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
			<h2>Class Hours</h2>
			<FormStyled>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createClassHour();
						window.location.reload();
					}}
				>
					<label>
						Period Name:
						<input
							type='text'
							value={classHour.hourName || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, hourName: e.target.value })
							}
						/>
					</label>
					<label>
						From:
						<input
							type='time'
							value={classHour.beginTime || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, beginTime: e.target.value })
							}
						/>
					</label>
					<label>
						To:
						<input
							type='time'
							value={classHour.endTime || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, endTime: e.target.value })
							}
						/>
					</label>
					<label>
						Type:
						<select
							value={classHour.type || ''}
							onChange={(e) =>
								setClassHour({ ...classHour, type: e.target.value })
							}
						>
							<option value='TEACHING'>Teaching</option>
							<option value='BREAK'>Break</option>
						</select>
					</label>
					<button type='submit'>+ Add Hour</button>
				</form>
			</FormStyled>

			<DataTableStyled style={{ marginTop: '20px' }}>
				<table>
					<thead>
						<tr>
							<th>Period Name</th>
							<th>Begin Time</th>
							<th>End Time</th>
							<th>Type</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>{displayClassHours()}</tbody>
				</table>
			</DataTableStyled>
			<Modal open={openDelete} onClose={handleCloseDelete}>
				<StyledModal>
					<h3>Are you sure you want to delete this term?</h3>
					<div className='btn'>
						<button
							onClick={(e) => {
								deleteClassHour({
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
					<h3>Edit Class Hour Info</h3>
					<form>
						<label>
							<span>Hour Name:</span>
							<input
								defaultValue={selectedData.hourName}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										hourName: e.target.value,
									});
								}}
								type='text'
							/>
						</label>
						<label>
							<span>Begin Time:</span>
							<input
								type='time'
								defaultValue={selectedData.beginTime}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										beginTime: e.target.value,
									});
								}}
							/>
						</label>
						<label>
							<span>End time:</span>
							<input
								type='time'
								defaultValue={selectedData.endTime}
								onChange={(e) => {
									setSelectedData({ ...selectedData, endTime: e.target.value });
								}}
							/>
						</label>
						<label>
							<span>Type:</span>
							<select
								defaultValue={selectedData.type}
								onChange={(e) => {
									setSelectedData({ ...selectedData, type: e.target.value });
								}}
							>
								<option value='TEACHING'>Teaching</option>
								<option value='BREAK'>Break</option>
							</select>
						</label>
					</form>

					<div className='btn'>
						<button
							style={{ background: '#2ecc71' }}
							onClick={() => {
								updateClassHour({
									variables: {
										type: selectedData.type,
									},
								});
								// window.location.reload(true);
								handleCloseEdit();
								setLoadingActive(true);
								console.log(selectedData.type);
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
		</StyledMain>
	);
}

export default ClassHours;

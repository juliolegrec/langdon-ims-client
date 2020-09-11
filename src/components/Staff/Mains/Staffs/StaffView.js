import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import StaffProfilePic from './StaffProfilePic';
import styled from 'styled-components';
import moment from 'moment';

const StaffPersoViewStyled = styled.div`
	display: grid;
	grid-template-columns: 150px 1fr;
	grid-gap: 10px;

	form {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 10px;

		label {
			width: 100%;
			font-weight: bold;
			margin-bottom: 5px;

			input {
				width: 100%;
				height: 30px;
				border: 1px solid #34495e;
				padding-left: 5px;
				border-radius: 2px;

				&[type='date'] {
					font-family: inherit;
				}

				&:disabled {
					border: 1px solid transparent;
				}
			}
		}
		.btn-group {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			align-self: center;
			grid-column-start: 1;
			grid-column-end: 4;

			button {
				border: 1px solid transparent;
				cursor: pointer;
				border-radius: 2px;
				color: white;
				font-weight: bold;

				&:focus {
					outline: 0;
				}

				&#save-btn {
					background-color: #2ecc71;
					&:hover {
						background-color: #27ae60;
					}
				}
				&#cancel-btn {
					background-color: #e74c3c;
					&:hover {
						background-color: #c0392b;
					}
					margin-left: 10px;
				}
				&#edit-btn {
					background-color: #e67e22;
					&:hover {
						background-color: #d35400;
					}
				}
			}
		}
	}
`;

const BackButtonStyled = styled.button`
	border: none;
	text-align: left;
	cursor: pointer;
	color: #1976d2;
	font-family: 'Source Sans Pro', sans-serif;
	font-size: 1rem;
`;

const LoadingImage = styled.div`
	width: 100%;
	height: 100%;
	background: white;
	display: flex;
	justify-content: center;
	opacity: 0.75;
`;

const SuccessMsg = styled.span`
	color: #2ecc71;
	font-size: 0.75em;
	opacity: 0;
	transition: all 1s;

	&.success {
		opacity: 1;
	}
`;

export default function StaffView(props) {
	const pageTitle = 'Staff Information';

	const [isEditable, setIsEditable] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isGood, setIsGood] = useState(false);
	const [staffPersoInfo, setStaffPersoInfo] = useState({});
	console.log(staffPersoInfo);
	const _id = props.match.params.id;

	const SELECTED_STAFF_INFO = gql`
		{
			staffFromId(_id: "${_id}") {
				staffID
				firstName
				lastName
				gender
				dob
				streetAddress
				city
				zipCode
				telephoneNumber
				emailAddress
				profilePic
			}
		}
  `;

	const { loading, error, data } = useQuery(SELECTED_STAFF_INFO);

	const UPDATE_STAFF_INFO = gql`
		mutation {
			updateStaffPersoInfo(
				_id: "${_id}"
				firstName: "${staffPersoInfo.firstName}"
				lastName: "${staffPersoInfo.lastName}"
				gender: "${staffPersoInfo.gender}"
				dob: "${staffPersoInfo.dob}"
				streetAddress: "${staffPersoInfo.streetAddress}"
				city: "${staffPersoInfo.city}"
				zipCode: "${staffPersoInfo.zipCode}"
				telephoneNumber: "${staffPersoInfo.telephoneNumber}"
				emailAddress: "${staffPersoInfo.emailAddress}"
				){
					_id
				}
			}
	`;

	const [updateStaffInfo] = useMutation(UPDATE_STAFF_INFO, {
		onCompleted: () => {
			setIsSaving(false);
			setIsGood(true);
			setTimeout(() => {
				setIsGood(false);
			}, 3000);
		},
	});

	if (loading) {
		return (
			<StyledMain>
				<h2>Loading...</h2>
			</StyledMain>
		);
	}
	if (error) {
		return (
			<StyledMain>
				<h2>Error!</h2>
			</StyledMain>
		);
	}

	const staffData = data.staffFromId;

	return (
		<StyledMain>
			<BackButtonStyled
				id="react-no-print"
				onClick={() => {
					props.history.push('/staff/admin/staffs');
				}}
			>
				&lt; Back
			</BackButtonStyled>
			<h2>
				{pageTitle} &nbsp;
				<SuccessMsg className={isGood ? 'success' : ''}>
					Information updated!
				</SuccessMsg>
			</h2>
			<StaffPersoViewStyled>
				<StaffProfilePic _id={_id} data={data} />
				{isSaving ? (
					<LoadingImage>
						<img
							style={{ position: 'absolute' }}
							src="https://res.cloudinary.com/imperium/image/upload/v1581344084/loading-spinner.gif"
							alt="loading"
						/>
					</LoadingImage>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<label>
							First Name:&nbsp;
							<input
								type="text"
								defaultValue={staffPersoInfo.firstName || staffData.firstName}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												firstName: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Last Name:&nbsp;
							<input
								type="text"
								defaultValue={staffPersoInfo.lastName || staffData.lastName}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												lastName: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Gender:&nbsp;
							<input
								type="text"
								defaultValue={staffPersoInfo.gender || staffData.gender}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												gender: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Date of Birth:&nbsp;
							<input
								type="date"
								defaultValue={
									moment(staffPersoInfo.dob).format('YYYY-MM-DD') ||
									moment(staffData.dob).format('YYYY-MM-DD')
								}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												dob: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Street Address:&nbsp;
							<input
								type="text"
								defaultValue={
									staffPersoInfo.streetAddress || staffData.streetAddress
								}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												streetAddress: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							City:&nbsp;
							<input
								type="text"
								defaultValue={staffPersoInfo.city || staffData.city}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												city: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Zip Code:&nbsp;
							<input
								type="text"
								defaultValue={staffPersoInfo.zipCode || staffData.zipCode}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												zipCode: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Telephone Number:&nbsp;
							<input
								type="text"
								defaultValue={
									staffPersoInfo.telephoneNumber || staffData.telephoneNumber
								}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												telephoneNumber: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						<label>
							Email Address:&nbsp;
							<input
								type="email"
								defaultValue={
									staffPersoInfo.emailAddress || staffData.emailAddress
								}
								disabled={isEditable ? null : 'disabled'}
								onChange={(e) =>
									isEditable
										? setStaffPersoInfo({
												...staffPersoInfo,
												emailAddress: e.target.value,
										  })
										: ''
								}
							/>
						</label>
						{isEditable ? (
							<div className="btn-group">
								<button
									id="save-btn"
									onClick={(e) => {
										updateStaffInfo();
										setIsSaving(true);
									}}
								>
									SAVE
								</button>
								<button
									id="cancel-btn"
									onClick={(e) => {
										setIsEditable(false);
										setStaffPersoInfo({});
									}}
								>
									CANCEL
								</button>
							</div>
						) : (
							<div className="btn-group">
								<button id="edit-btn" onClick={(e) => setIsEditable(true)}>
									EDIT
								</button>
							</div>
						)}
					</form>
				)}
			</StaffPersoViewStyled>
		</StyledMain>
	);
}

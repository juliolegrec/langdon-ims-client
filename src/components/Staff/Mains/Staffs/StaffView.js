import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
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

export default function StaffView(props) {
	const [isEditable, setIsEditable] = useState(false);
	const [staffPersoInfo, setStaffPersoInfo] = useState({});
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

	const pageTitle = 'Staff Information';

	return (
		<StyledMain>
			<h2>{pageTitle}</h2>
			<StaffPersoViewStyled>
				<StaffProfilePic _id={_id} data={data} />
				<form onSubmit={(e) => e.preventDefault()}>
					<label>
						First Name:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.firstName}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Last Name:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.lastName}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Gender:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.gender}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Date of Birth:&nbsp;
						<input
							type='date'
							defaultValue={moment(data.staffFromId.dob).format('YYYY-MM-DD')}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Street Address:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.streetAddress}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						City:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.city}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Zip Code:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.zipCode}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Telephone Number:&nbsp;
						<input
							type='text'
							defaultValue={data.staffFromId.telephoneNumber}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					<label>
						Email Address:&nbsp;
						<input
							type='email'
							defaultValue={data.staffFromId.emailAddress}
							disabled={isEditable ? null : 'disabled'}
						/>
					</label>
					{isEditable ? (
						<div className='btn-group'>
							<button id='save-btn'>SAVE</button>
							<button id='cancel-btn' onClick={(e) => setIsEditable(false)}>
								CANCEL
							</button>
						</div>
					) : (
						<div className='btn-group'>
							<button id='edit-btn' onClick={(e) => setIsEditable(true)}>
								EDIT
							</button>
						</div>
					)}
				</form>
			</StaffPersoViewStyled>
		</StyledMain>
	);
}

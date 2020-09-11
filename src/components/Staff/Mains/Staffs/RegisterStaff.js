import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import StyledMain from '../../styles/MainStyled';

const NewStaffFormStyled = styled.form`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;

	label {
		width: 100%;
		font-weight: bold;

		input {
			width: 100%;
			height: 30px;
			border: 1px solid #34495e;
			padding-left: 5px;
			border-radius: 2px;

			&[type='date'] {
				font-family: inherit;
			}
		}
	}

	.btn-group {
		margin: 15px auto;
		width: 50%;
		grid-column-start: 1;
		grid-column-end: 3;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 10px;
		/* justify-content: space-around; */

		button {
			padding: 5px 0;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;

			&:nth-child(2) {
				background-color: #e74c3c;
			}
		}
	}
`;

export default function RegisterStaff() {
	const [newStaff, setNewStaff] = useState({});

	const pageTitle = 'Staff Registration';

	const CREATE_STAFF = gql`
    mutation CreateStudent ($profilePic: Upload!) {
      createStaff(
        staffInput: {
          firstName: "${newStaff.firstName}"
          lastName: "${newStaff.lastName}"
          gender: "${newStaff.gender}"
          dob: "${newStaff.dob}"
          streetAddress: "${newStaff.streetAddress}"
          city: "${newStaff.city}"
          zipCode: "${newStaff.zipCode}"
          telephoneNumber: "${newStaff.telephoneNumber}"
          emailAddress: "${newStaff.emailAddress}"
          profilePic: $profilePic
        }
    ) {
      _id
    }
    }
  `;

	const [createStaff] = useMutation(CREATE_STAFF);

	return (
		<StyledMain>
			<h2>{pageTitle}</h2>
			<NewStaffFormStyled
				autoComplete='off'
				onSubmit={(e) => {
					e.preventDefault();
					createStaff({
						variables: { profilePic: newStaff.profilePic },
					});
				}}
			>
				<label>
					First Name:&nbsp;
					<input
						type='text'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, firstName: e.target.value })
						}
					/>
				</label>
				<label>
					Last Name:&nbsp;
					<input
						type='text'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, lastName: e.target.value })
						}
					/>
				</label>
				<label>
					Gender:&nbsp;
					<input
						type='text'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, gender: e.target.value })
						}
					/>
				</label>
				<label>
					Date of Birth:&nbsp;
					<input
						type='date'
						required
						onChange={(e) => setNewStaff({ ...newStaff, dob: e.target.value })}
					/>
				</label>
				<label>
					Street Address:&nbsp;
					<input
						type='text'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, streetAddress: e.target.value })
						}
					/>
				</label>
				<label>
					City:&nbsp;
					<input
						type='text'
						required
						onChange={(e) => setNewStaff({ ...newStaff, city: e.target.value })}
					/>
				</label>
				<label>
					Zip Code:&nbsp;
					<input
						type='text'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, zipCode: e.target.value })
						}
					/>
				</label>
				<label>
					Telephone Number:&nbsp;
					<input
						type='text'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, telephoneNumber: e.target.value })
						}
					/>
				</label>
				<label>
					Email Address:&nbsp;
					<input
						type='email'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, emailAddress: e.target.value })
						}
					/>
				</label>
				<label>
					Profile picture:
					<input
						type='file'
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, profilePic: e.target.files[0] })
						}
					/>
				</label>
				<div className='btn-group'>
					<button id='save-btn'>SAVE</button>
					<button id='cancel-btn'>CANCEL</button>
				</div>
			</NewStaffFormStyled>
		</StyledMain>
	);
}

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import RegistrationStyled from '../../styles/RegistrationStyled';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const NewStaffFormStyled = styled.form`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
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
			font-size: 1.1rem;

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

const StyledDialog = styled.div`
	width: 100%;

	h3 {
		text-align: center;
		margin-bottom: 10px;
		color: #2ecc71;
	}
`;

export default function RegisterStaff(props) {
	const [newStaff, setNewStaff] = useState({
		firstName: 'Samoy',
		lastName: 'Legrec',
		gender: 'Male',
		dob: '1992-02-05',
		streetAddress: 'Street',
		city: 'City',
		zipCode: '12345',
		telephoneNumber: '134567',
		emailAddress: 'mail.mail@mail.com',
	});

	const [isSaving, setIsSaving] = useState(false);
	const [open, setOpen] = useState(false);

	console.log(newStaff);

	const pageTitle = 'Staff Registration';

	const CREATE_STAFF = gql`
    mutation CreateStaff ($profilePic: Upload!) {
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

	const [createStaff] = useMutation(CREATE_STAFF, {
		onCompleted: () => {
			setIsSaving(false);
			handleClickOpen();
		},
	});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function goToStaffsView() {
		// window.location.href = '/staff/students';
		props.history.push('/staff/admin/staffs');
	}

	function goToNewStaffView() {
		window.location.href = '/staff/admin/staff/register-staff';
	}

	return (
		<RegistrationStyled>
			{isSaving ? (
				<LoadingImage>
					<img
						style={{ position: 'absolute' }}
						src="https://res.cloudinary.com/imperium/image/upload/v1581344084/loading-spinner.gif"
						alt="loading"
					/>
				</LoadingImage>
			) : (
				''
			)}
			<h2>{pageTitle}</h2>
			<NewStaffFormStyled
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault();
					createStaff({
						variables: { profilePic: newStaff.profilePic },
					});
					setIsSaving(true);
				}}
			>
				<label>
					First Name:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.firstName}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, firstName: e.target.value })
						}
					/>
				</label>
				<label>
					Last Name:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.lastName}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, lastName: e.target.value })
						}
					/>
				</label>
				<label>
					Gender:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.gender}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, gender: e.target.value })
						}
					/>
				</label>
				<label>
					Date of Birth:&nbsp;
					<input
						type="date"
						defaultValue={newStaff.dob}
						required
						onChange={(e) => setNewStaff({ ...newStaff, dob: e.target.value })}
					/>
				</label>
				<label>
					Street Address:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.streetAddress}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, streetAddress: e.target.value })
						}
					/>
				</label>
				<label>
					City:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.city}
						required
						onChange={(e) => setNewStaff({ ...newStaff, city: e.target.value })}
					/>
				</label>
				<label>
					Zip Code:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.zipCode}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, zipCode: e.target.value })
						}
					/>
				</label>
				<label>
					Telephone Number:&nbsp;
					<input
						type="text"
						defaultValue={newStaff.telephoneNumber}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, telephoneNumber: e.target.value })
						}
					/>
				</label>
				<label>
					Email Address:&nbsp;
					<input
						type="email"
						defaultValue={newStaff.emailAddress}
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, emailAddress: e.target.value })
						}
					/>
				</label>
				<label>
					Profile picture:
					<input
						type="file"
						required
						onChange={(e) =>
							setNewStaff({ ...newStaff, profilePic: e.target.files[0] })
						}
					/>
				</label>
				<div className="btn-group">
					<button id="save-btn">SAVE</button>
					<button id="cancel-btn">CANCEL</button>
				</div>
			</NewStaffFormStyled>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<StyledDialog>
						<h3>Staff Registered Successfully!</h3>
						<Button color="primary" onClick={() => goToNewStaffView()}>
							Register Another Staff
						</Button>
						<Button onClick={() => goToStaffsView()}>
							Go Back to Staffs List
						</Button>
					</StyledDialog>
				</DialogContent>
			</Dialog>
		</RegistrationStyled>
	);
}

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StaffPersonalDetails from './StaffPersonalDetails';
import StyledMain from '../../styles/MainStyled';
import UserProfilePic from './UserProfilePic';
import styled from 'styled-components';

const StaffAccountStyled = styled.div`
	/* background: pink; */
	display: grid;
	grid-template-columns: 200px 1fr;
	grid-auto-rows: auto auto;
	grid-gap: 15px;

	section {
		form {
			width: 100%;
			display: grid;
			/* flex-direction: column; */
			/* background: red; */

			label {
				display: block;
				margin: 5px 0;
				font-weight: bold;

				input {
					display: block;
					width: 100%;
					height: 30px;
					border: 1px solid #2980b9;
					border-radius: 2px;
					font-size: 1rem;
					padding-left: 5px;

					&[type='date'] {
						font-family: inherit;
					}

					&:disabled,
					&[disabled] {
						border: 1px solid transparent;
					}
				}
			}
			button {
				/* justify-self: center; */
				align-self: center;
				padding: 10px 15px;
				font-weight: bold;
				border: 1px solid transparent;
				font-size: 1rem;
				background-color: #2ecc71;
				border-radius: 3px;
				color: white;
				cursor: pointer;
				margin-top: 5px;

				&:disabled,
				&[disabled] {
					border: 1px solid #999999;
					background-color: #cccccc;
					color: #666666;
				}
			}

			&.perso-info-form {
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-gap: 10px;
			}

			&.password-change-form {
				width: 50%;
			}
		}
		&:nth-child(3) {
			grid-column-start: 1;
			grid-column-end: 3;
		}
	}

	&.profile-pic {
		display: grid;
		grid-template-columns: auto;
		background: pink !important;
	}
`;

export default function UserAccount() {
	const [userPassword, setUserPassword] = useState({});
	const [confirmPass, setConfirmPass] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isWrong, setIsWrong] = useState(false);
	const [isGood, setIsGood] = useState(false);

	const username = JSON.parse(
		localStorage.getItem('state')
	).sessionState.authUser.username.toString();

	const FIND_USER_INFO = gql`
		{
			findStaffFromUsername(username: "${username}") {
				_id
				staffID
				firstName
				lastName
				gender
				dob
				username
				streetAddress
				city
				zipCode
				telephoneNumber
				emailAddress
				profilePic
			}
		}
	`;

	const { loading, error, data } = useQuery(FIND_USER_INFO);

	const UPDATE_PASSWORD = gql`
		mutation {
			updateUserPassword(
				username: "${username}"
				oldPassword: "${userPassword.oldPassword}"
				newPassword: "${userPassword.newPassword}"
			) {
				_id
				username
				role
			}
		}
	`;

	const [updatePassword] = useMutation(UPDATE_PASSWORD, {
		onError: (error) => {
			setIsSaving(false);
			if (error) {
				setIsWrong(true);
				setUserPassword({});
				setConfirmPass(false);
			}
		},
		onCompleted: () => {
			setIsSaving(false);
			setIsWrong(false);
			setIsGood(true);
			setTimeout(() => {
				setIsGood(false);
			}, 3000);
		},
	});

	if (loading) {
		return 'loading';
	}
	if (error) {
		return 'error';
	}

	const userData = data.findStaffFromUsername;

	function confirmPassword(password) {
		if (password === userPassword.newPassword) {
			setConfirmPass(true);
			return;
		}
	}

	return (
		<StyledMain>
			<h2>User Account Info</h2>
			<StaffAccountStyled>
				<UserProfilePic className="profile-pic" data={userData} />
				<StaffPersonalDetails data={userData} />
				<section>
					<h3>Change Password:</h3>
					{isSaving ? (
						<img
							src="https://res.cloudinary.com/imperium/image/upload/v1581344084/loading-spinner.gif"
							alt="saving"
						/>
					) : (
						<form
							className="password-change-form"
							onSubmit={(e) => {
								e.preventDefault();
								updatePassword();
								setIsSaving(true);
							}}
						>
							<label>
								Current Password:
								<input
									type="password"
									onChange={(e) =>
										setUserPassword({
											...userPassword,
											oldPassword: e.target.value,
										})
									}
								/>
								{isWrong ? (
									<pre style={{ color: '#e74c3c' }}>
										Incorrect current password!
									</pre>
								) : (
									''
								)}
								{isGood ? (
									<pre style={{ color: '#2ecc71' }}>
										Password changed successfully!
									</pre>
								) : (
									''
								)}
							</label>
							<label>
								New Password:
								<input
									type="password"
									onChange={(e) =>
										setUserPassword({
											...userPassword,
											newPassword: e.target.value,
										})
									}
								/>
							</label>
							<label>
								Confirm New Password:
								<input
									type="password"
									onChange={(e) => {
										setUserPassword({
											...userPassword,
											confirmNewPassword: e.target.value,
										});
										confirmPassword(e.target.value);
									}}
								/>
							</label>
							<button
								disabled={
									userPassword.oldPassword &&
									userPassword.newPassword &&
									confirmPass
										? ''
										: 'disabled'
								}
							>
								SAVE PASSWORD
							</button>
						</form>
					)}
				</section>
			</StaffAccountStyled>
		</StyledMain>
	);
}

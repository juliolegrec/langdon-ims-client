import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';

export default function PasswordChanger() {
	const [userPassword, setUserPassword] = useState({});
	const [confirmPass, setConfirmPass] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isWrong, setIsWrong] = useState(false);
	const [isGood, setIsGood] = useState(false);

	const username = JSON.parse(
		localStorage.getItem('state')
	).sessionState.authUser.username.toString();

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

	function confirmPassword(password) {
		if (password === userPassword.newPassword) {
			setConfirmPass(true);
			return;
		}
	}

	return (
		<section>
			<h2>Change Password:</h2>
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
	);
}

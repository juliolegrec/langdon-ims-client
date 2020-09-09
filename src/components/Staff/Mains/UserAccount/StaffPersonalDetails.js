import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import moment from 'moment';
import { capitalize } from '../../../../helpers';

export default function StaffPersonalDetails(props) {
	const [staffPersoInfo, setStaffPersoInfo] = useState({
		firstName: props.data.firstName,
		lastName: props.data.lastName,
		gender: capitalize(props.data.gender),
		dob: moment(props.data.dob).format('YYYY-MM-DD'),
		streetAddress: props.data.streetAddress,
		city: props.data.city,
		zipCode: props.data.zipCode,
		telephoneNumber: props.data.telephoneNumber,
		emailAddress: props.data.emailAddress,
	});
	const [isGood, setIsGood] = useState(false);
	const [isEditable, setisEditable] = useState(false);

	console.log(staffPersoInfo);

	const UPDATE_PERSO_INFO = gql`
		mutation {
			updateStaffPersoInfo(
				_id: "${props.data._id}"
        firstName: "${staffPersoInfo.firstName}"
        lastName: "${staffPersoInfo.lastName}"
				gender: "${capitalize(staffPersoInfo.gender)}"
				dob: "${staffPersoInfo.dob}"
				streetAddress: "${staffPersoInfo.streetAddress}"
				city: "${staffPersoInfo.city}"
				zipCode: "${staffPersoInfo.zipCode}"
				telephoneNumber: "${staffPersoInfo.telephoneNumber}"
				emailAddress: "${staffPersoInfo.emailAddress}"
			) {
				_id
				gender
				dob
				zipCode
			}
		}
  `;

	const [updatePersoInfo] = useMutation(UPDATE_PERSO_INFO, {
		onCompleted: () => {
			setIsGood(true);
			setTimeout(() => {
				setIsGood(false);
			}, 3000);
		},
	});

	return (
		<section>
			<h3>Personal Information</h3>
			{isGood ? (
				<pre style={{ color: '#2ecc71' }}>
					Information changed successfully!
				</pre>
			) : (
				''
			)}
			<form
				className="perso-info-form"
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<label>
					First Name:
					<input
						type="text"
						defaultValue={staffPersoInfo.firstName}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({
								...staffPersoInfo,
								firstName: e.target.value,
							})
						}
					/>
				</label>
				<label>
					Last Name:
					<input
						type="text"
						defaultValue={staffPersoInfo.lastName}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({ ...staffPersoInfo, lastName: e.target.value })
						}
					/>
				</label>
				<label>
					Gender:
					<input
						type="text"
						defaultValue={capitalize(staffPersoInfo.gender)}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({ ...staffPersoInfo, gender: e.target.value })
						}
					/>
				</label>
				<label>
					Date of birth:
					<input
						type="date"
						defaultValue={moment(staffPersoInfo.dob).format('YYYY-MM-DD')}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({ ...staffPersoInfo, dob: e.target.value })
						}
					/>
				</label>
				<label>
					Street Address:
					<input
						type="text"
						defaultValue={staffPersoInfo.streetAddress}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({
								...staffPersoInfo,
								streetAddress: e.target.value,
							})
						}
					/>
				</label>
				<label>
					City:
					<input
						type="text"
						defaultValue={staffPersoInfo.city}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({ ...staffPersoInfo, city: e.target.value })
						}
					/>
				</label>
				<label>
					Zip Code:
					<input
						type="text"
						defaultValue={staffPersoInfo.zipCode}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({ ...staffPersoInfo, zipCode: e.target.value })
						}
					/>
				</label>
				<label>
					Telephone Number:
					<input
						type="text"
						defaultValue={staffPersoInfo.telephoneNumber}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({
								...staffPersoInfo,
								telephoneNumber: e.target.value,
							})
						}
					/>
				</label>
				<label>
					Email:
					<input
						type="email"
						defaultValue={staffPersoInfo.emailAddress}
						disabled={isEditable ? null : 'disabled'}
						onChange={(e) =>
							setStaffPersoInfo({
								...staffPersoInfo,
								emailAddress: e.target.value,
							})
						}
					/>
				</label>
				{isEditable ? (
					<div className="btn-group">
						<button
							onClick={(e) => {
								updatePersoInfo();
								setisEditable(false);
							}}
						>
							SAVE
						</button>
						<button
							onClick={(e) => {
								setisEditable(false);
							}}
						>
							CANCEL
						</button>
					</div>
				) : (
					<button onClick={() => setisEditable(true)}>EDIT</button>
				)}
			</form>
		</section>
	);
}

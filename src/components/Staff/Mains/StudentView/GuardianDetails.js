import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';

function GuardianDetails(props) {
	const [guardian, setGuardian] = useState(
		props.data.studentFromId.guardianDetails[0]
	);

	const [editable, setEditable] = useState(false);

	function SaveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	const UPDATE_GUARDIAN_INFO = gql`
		mutation{
			updateStudentGuardianInfo(
				_id: "${guardian._id}"
				firstName: "${guardian.firstName}"
				lastName: "${guardian.lastName}"
				relationship: "${guardian.relationship}"
				mobilePhone: "${guardian.mobilePhone}"
				workPhone: "${guardian.workPhone}"
				emailAddress: "${guardian.emailAddress}"
			) {
				_id
			}
		}
	`;

	const [updateGuardianInfo] = useMutation(UPDATE_GUARDIAN_INFO);

	return (
		<section>
			<h2>
				Guardian Details{' '}
				{editable ? (
					<>
						<span
							className='saveBtn'
							onClick={() => {
								updateGuardianInfo();
								SaveToDB();
							}}
						>
							save
						</span>
						<span className='cancelBtn' onClick={() => cancelModif()}>
							cancel
						</span>
					</>
				) : (
					<span className='editBtn' onClick={() => setEditable(true)}>
						edit
					</span>
				)}
			</h2>
			<div className='guardian-details'>
				<form>
					<label>
						First Name:
						<input
							type='text'
							value={guardian.firstName}
							disabled={editable ? null : 'disabled'}
							onChange={e =>
								editable
									? setGuardian({
											...guardian,
											firstName: e.target.value
									  })
									: 'NDA'
							}
						/>
					</label>
					<label>
						Last Name:
						<input
							type='text'
							value={guardian.lastName}
							disabled={editable ? null : 'disabled'}
							onChange={e =>
								editable
									? setGuardian({
											...guardian,
											lastName: e.target.value
									  })
									: 'NDA'
							}
						/>
					</label>
					<label>
						Relationship:
						<input
							type='text'
							value={guardian.relationship}
							disabled={editable ? null : 'disabled'}
							onChange={e =>
								editable
									? setGuardian({
											...guardian,
											relationship: e.target.value
									  })
									: 'NDA'
							}
						/>
					</label>
					<label>
						Mobile Phone:
						<input
							type='text'
							value={guardian.mobilePhone}
							disabled={editable ? null : 'disabled'}
							onChange={e =>
								editable
									? setGuardian({
											...guardian,
											mobilePhone: e.target.value
									  })
									: 'NDA'
							}
						/>
					</label>
					<label>
						Work Phone:
						<input
							type='text'
							value={guardian.workPhone}
							disabled={editable ? null : 'disabled'}
							onChange={e =>
								editable
									? setGuardian({
											...guardian,
											workPhone: e.target.value
									  })
									: 'NDA'
							}
						/>
					</label>
					<label>
						Email Address:
						<input
							type='email'
							value={guardian.emailAddress}
							disabled={editable ? null : 'disabled'}
							onChange={e =>
								editable
									? setGuardian({
											...guardian,
											emailAddress: e.target.value
									  })
									: 'NDA'
							}
						/>
					</label>
				</form>
			</div>
		</section>
	);
}

export default GuardianDetails;

import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import moment from 'moment';
import { capitalize } from '../../../../helpers';
import ProfilePic from './ProfilePic';

export default function PersonalDetails(props) {
	const [editable, setEditable] = useState(false);
	// const [loadingPic, setLoadingPic] = useState(false);

	const [studentPersoInfo, setStudentPersoInfo] = useState({
		gender: capitalize(props.data.studentFromId.gender),
		dob: moment(props.data.studentFromId.dob).format('YYYY-MM-DD'),
		streetAddress: props.data.studentFromId.streetAddress,
		city: props.data.studentFromId.city,
		zipCode: props.data.studentFromId.zipCode,
		telephoneNumber: props.data.studentFromId.telephoneNumber,
		emailAddress: props.data.studentFromId.emailAddress,
	});

	const UPDATE_PERSO_INFO = gql`
		mutation {
			updateStudentPersoInfo(
				_id: "${props.studentID}"
				gender: "${capitalize(studentPersoInfo.gender)}"
				dob: "${studentPersoInfo.dob}"
				streetAddress: "${studentPersoInfo.streetAddress}"
				city: "${studentPersoInfo.city}"
				zipCode: "${studentPersoInfo.zipCode}"
				telephoneNumber: "${studentPersoInfo.telephoneNumber}"
				emailAddress: "${studentPersoInfo.emailAddress}"
			) {
				_id
				gender
				dob
				zipCode
			}
		}
	`;

	const [updateInfo] = useMutation(UPDATE_PERSO_INFO, {
		onCompleted() {
			// setLoadingPic(false);
		},
	});

	function saveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	// function loadingPhotoPic() {
	// 	setLoadingPic(true);
	// 	setTimeout(() => {
	// 		window.location.reload();
	// 	}, 7000);
	// }

	var studentAge = `${moment().diff(studentPersoInfo.dob, 'years')} years old`;

	return (
		<section>
			<h2>
				Personal Details{' '}
				{editable ? (
					<>
						<span
							className='saveBtn'
							onClick={() => {
								updateInfo();
								saveToDB();
								// loadingPhotoPic();
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
			<div className='personal-details'>
				<ProfilePic
					studentMongoID={props.studentID}
					data={props.data.studentFromId}
				/>
				<form>
					<label>
						Gender:
						<input
							data-lpignore='true'
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											gender: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.gender}
						/>
					</label>

					<label>
						Date of Birth:
						<input
							type='date'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											dob: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.dob}
						/>
					</label>

					<label>
						Age:
						<input type='text' disabled value={studentAge} />
					</label>

					<label>
						Street Address:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											streetAddress: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.streetAddress}
						/>
					</label>

					<label>
						City:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											city: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.city}
						/>
					</label>

					<label>
						Zip Code:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											zipCode: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.zipCode}
						/>
					</label>

					<label>
						Telephone Number:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											telephoneNumber: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.telephoneNumber}
						/>
					</label>

					<label>
						Email Address:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setStudentPersoInfo({
											...studentPersoInfo,
											emailAddress: e.target.value,
									  })
									: ''
							}
							value={studentPersoInfo.emailAddress}
						/>
					</label>
				</form>
			</div>
		</section>
	);
}

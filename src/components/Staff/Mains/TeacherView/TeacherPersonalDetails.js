import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import moment from 'moment';
import { capitalize } from '../../../../helpers';
import TeacherProfilePic from './TeacherProfilePic';

export default function TeacherPersonalDetails(props) {
	const [editable, setEditable] = useState(false);
	// const [loadingPic, setLoadingPic] = useState(false);

	const [teacherPersoInfo, setTeacherPersoInfo] = useState({
		gender: capitalize(props.data.teacherFromId.gender),
		dob: moment(props.data.teacherFromId.dob).format('YYYY-MM-DD'),
		streetAddress: props.data.teacherFromId.streetAddress,
		city: props.data.teacherFromId.city,
		zipCode: props.data.teacherFromId.zipCode,
		telephoneNumber: props.data.teacherFromId.telephoneNumber,
		emailAddress: props.data.teacherFromId.emailAddress,
	});

	const UPDATE_PERSO_INFO = gql`
		mutation {
			updateTeacherPersoInfo(
				_id: "${props.teacherID}"
				gender: "${capitalize(teacherPersoInfo.gender)}"
				dob: "${teacherPersoInfo.dob}"
				streetAddress: "${teacherPersoInfo.streetAddress}"
				city: "${teacherPersoInfo.city}"
				zipCode: "${teacherPersoInfo.zipCode}"
				telephoneNumber: "${teacherPersoInfo.telephoneNumber}"
				emailAddress: "${teacherPersoInfo.emailAddress}"
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

	var teacherAge = `${moment().diff(teacherPersoInfo.dob, 'years')} years old`;

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
					<span
						id='react-no-print'
						className='editBtn'
						onClick={() => setEditable(true)}
					>
						edit
					</span>
				)}
			</h2>
			<div className='personal-details'>
				<TeacherProfilePic
					teacherMongoID={props.teacherID}
					data={props.data.teacherFromId}
				/>
				<form>
					<label htmlFor=''>
						Gender:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											gender: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.gender}
						/>
					</label>

					<label htmlFor=''>
						Date of Birth:
						<input
							type='date'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											dob: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.dob}
						/>
					</label>

					<label htmlFor=''>
						Age:
						<input type='text' disabled value={teacherAge} />
					</label>

					<label htmlFor=''>
						Street Address:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											streetAddress: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.streetAddress}
						/>
					</label>

					<label htmlFor=''>
						City:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											city: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.city}
						/>
					</label>

					<label htmlFor=''>
						Zip Code:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											zipCode: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.zipCode}
						/>
					</label>

					<label htmlFor=''>
						Telephone Number:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											telephoneNumber: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.telephoneNumber}
						/>
					</label>

					<label htmlFor=''>
						Email Address:
						<input
							type='text'
							disabled={editable ? null : 'disabled'}
							onChange={(e) =>
								editable
									? setTeacherPersoInfo({
											...teacherPersoInfo,
											emailAddress: e.target.value,
									  })
									: ''
							}
							value={teacherPersoInfo.emailAddress}
						/>
					</label>
				</form>
			</div>
		</section>
	);
}

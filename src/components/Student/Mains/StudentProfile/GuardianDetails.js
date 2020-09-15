import React from 'react';

export default function GuardianDetails(props) {
	// const [guardian] = useState(
	// 	props.data.findStudentFromUsername.guardianDetails[0]
	// );
	const guardian = props.data.findStudentFromUsername.guardianDetails[0];

	return (
		<section>
			<h2>Guardian Details</h2>
			<div className='guardian-details'>
				<form>
					<label>
						First Name:
						<input type='text' disabled value={guardian.firstName} />
					</label>
					<label>
						Last Name:
						<input type='text' disabled value={guardian.lastName} />
					</label>
					<label>
						Relationship:
						<input type='text' disabled value={guardian.relationship} />
					</label>
					<label>
						Mobile Phone:
						<input type='text' disabled value={guardian.mobilePhone} />
					</label>
					<label>
						Work Phone:
						<input type='text' disabled value={guardian.workPhone} />
					</label>
					<label>
						Email Address:
						<input type='email' disabled value={guardian.emailAddress} />
					</label>
				</form>
			</div>
		</section>
	);
}

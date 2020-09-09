import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import moment from 'moment';

function SchoolClassDetails(props) {
	const [editable, setEditable] = useState(false);
	const [studentGrade, setStudentGrade] = useState(
		props.data.studentFromId.grade
	);
	const [division, setDivision] = useState(props.data.studentFromId.division);

	function SaveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	const UPDATE_STUDENT_CLASS_INFO = gql`
		mutation {
			updateStudentClassInfo(
				_id: "${props.studentID}"
				grade: "${studentGrade}"
				division: "${division}"
			) {
				_id
				firstName
				lastName
				grade
				division
			}
		}
	`;

	const [updateClassInfo] = useMutation(UPDATE_STUDENT_CLASS_INFO);

	return (
		<section>
			<h2>
				School &amp; Class Details{' '}
				{editable ? (
					<>
						<span
							className='saveBtn'
							onClick={e => {
								updateClassInfo();
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
			<form>
				<label>
					Enrollment Date:
					<input
						type='date'
						disabled
						value={moment(props.data.studentFromId.enrollmentDate).format(
							'YYYY-MM-DD'
						)}
					/>
				</label>
				<label>
					Current Grade:
					<input
						type='text'
						disabled={editable ? null : 'disabled'}
						value={studentGrade}
						onChange={e => (editable ? setStudentGrade(e.target.value) : '')}
					/>
				</label>
				<label>
					Current Division:
					<input
						type='text'
						disabled={editable ? null : 'disabled'}
						value={division}
						onChange={e => (editable ? setDivision(e.target.value) : '')}
					/>
				</label>
			</form>
		</section>
	);
}

export default SchoolClassDetails;

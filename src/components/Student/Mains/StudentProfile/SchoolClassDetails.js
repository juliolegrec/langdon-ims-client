import React, { useState } from 'react';
import moment from 'moment';

export default function SchoolClassDetails(props) {
	const { classDetails } = props.data.findStudentFromUsername;

	const [classInfo] = useState({
		grade: classDetails.grade,
		classID: classDetails.classID,
		className: classDetails.className,
	});

	return (
		<section>
			<h2>School &amp; Class Details </h2>
			<form>
				<label>
					Enrollment Date:
					<input
						type='date'
						disabled
						value={moment(
							props.data.findStudentFromUsername.enrollmentDate
						).format('YYYY-MM-DD')}
					/>
				</label>
				<label>
					Current Grade:
					<input type='text' disabled value={classInfo.grade} />
				</label>
				<label>
					Current Class:
					<input type='text' disabled value={classInfo.className} />
				</label>
			</form>
		</section>
	);
}

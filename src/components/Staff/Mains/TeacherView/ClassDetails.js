import React, { useState } from 'react';
import styled from 'styled-components';

const ClassDetailsStyled = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
	margin-top: 15px;
`;

function ClassDetails(props) {
	const [classAssigned] = useState(props.data.teacherFromId.classAssigned);
	const [subjectTeaching] = useState(props.data.teacherFromId.subjectTaught);

	return (
		<section>
			<h2>Class Details </h2>
			<ClassDetailsStyled>
				<div id="class-assigned">
					<h3>Class(es) assigned:</h3>
					<ul>
						{classAssigned.map((classAssign) => (
							<li key={classAssign._id}>
								{classAssign.grade} {classAssign.className}
							</li>
						))}
					</ul>
				</div>
				<div id="subject-teaching">
					<h3>Subject(s) teaching:</h3>
					<ul>
						{subjectTeaching.map((subject) => (
							<li key={subject._id}>{subject.subjectName}</li>
						))}
					</ul>
				</div>
			</ClassDetailsStyled>
		</section>
	);
}

export default ClassDetails;

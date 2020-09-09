import React, { useState } from 'react';
// import { gql } from 'apollo-boost';
// import { useMutation } from 'react-apollo';
import styled from 'styled-components';

const ClassDetailsStyled = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
	margin-top: 15px;
`;

function ClassDetails(props) {
	const [editable, setEditable] = useState(false);
	const [classAssigned] = useState(props.data.teacherFromId.classAssigned);
	const [subjectTeaching] = useState(props.data.teacherFromId.subjectTaught);

	function SaveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	return (
		<section>
			<h2>
				Class Details{' '}
				{editable ? (
					<>
						<span
							className='saveBtn'
							onClick={() => {
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
			<ClassDetailsStyled>
				<div id='class-assigned'>
					<h3>Class(es) assigned:</h3>
					<ul>
						{classAssigned.map((classAssign) => (
							<li key={classAssign._id}>
								{classAssign.grade} {classAssign.className}
							</li>
						))}
					</ul>
				</div>
				<div id='subject-teaching'>
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

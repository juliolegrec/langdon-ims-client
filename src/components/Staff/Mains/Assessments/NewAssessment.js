import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import styled from 'styled-components';

const NewAssessmentFormStyle = styled.form`
	/* background: pink; */
	padding: 20px 10px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	grid-gap: 10px;

	label {
		/* width: 100%; */
		/* height: 50px; */

		input,
		select {
			font-size: 1.25rem;
			width: 100%;
			/* height: 50px; */
		}
		input[type='checkbox'] {
			width: auto;
			margin-right: 5px;
		}
	}

	/* .periods {
		grid-column-start: 2;
		grid-column-end: 4;

		& > label {
			margin-right: 10px;
		}
	} */

	.select-period {
		grid-row-start: 2;
		grid-row-end: 4;
	}

	.markings {
		grid-row-start: 2;
		grid-row-end: 4;
	}

	.btn-group {
		height: 50%;
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		grid-column-start: 3;
		grid-column-end: 4;
		grid-row-start: 2;
		grid-row-end: 4;
		align-self: center;

		button {
			width: 100px;
			height: 40px;
			background-color: #0068d9;
			color: white;
			font-weight: bold;
			font-size: 1rem;
			cursor: pointer;
			border: 1px solid transparent;
			border-radius: 0.25rem;

			&.save-btn {
				background-color: #2ecc71;
			}

			&.cancel-btn {
				background-color: #e74c3c;
			}
		}
	}
`;

const GET_ALL_INFOS = gql`
	{
		allClasses {
			_id
			grade
			className
			classID
		}

		allSubjects {
			_id
			subjectID
			subjectName
		}
		allSchoolTerms {
			_id
			termName
			beginDate
			endDate
		}
	}
`;

export default function NewAssessment(props) {
	const [newEntryData, setNewEntryData] = useState({});
	const [term, setTerm] = useState();
	console.log(term);

	const REGISTER_ASSESSMENT = gql`
		mutation {
			registerAssessment(
				assessmentInput: {
					assessmentDate: "${newEntryData.assessmentDate}"
					period: "${newEntryData.period}"
					subject: "${newEntryData.subject}"
					gradeClass: "${newEntryData.gradeClass}"
					term: "${term}"
					markings: ${newEntryData.markings}
				}
			) {
				assessmentID
			}
		}
	`;

	const [registerAssessment] = useMutation(REGISTER_ASSESSMENT, {
		onCompleted: () => {
			props.history.push('/staff/assessments');
		},
	});

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	if (loading) {
		return 'Loading...';
	}
	if (error) {
		return 'Error!';
	}

	function getTerm(assessmentDate) {
		const terms = data.allSchoolTerms;
		const selectedDate = new Date(assessmentDate);

		const filteredTerms = terms.filter((term) => {
			const beginDate = new Date(term.beginDate);
			const endDate = new Date(term.endDate);
			return selectedDate >= beginDate && selectedDate <= endDate;
		});

		console.log(filteredTerms);

		if (filteredTerms[0] !== undefined && assessmentDate !== undefined) {
			return filteredTerms[0].termName;
		}
		// if (filteredTerms !== undefined && assessmentDate !== undefined) {
		// 	return filteredTerms[0].termName;
		// }
	}

	function displayClasses() {
		const allClasses = data.allClasses;

		return allClasses
			.sort((a, b) => {
				return parseInt(a.grade) < parseInt(b.grade) ? -1 : 1;
			})
			.map((sClass) => {
				return (
					<option key={sClass._id} value={sClass.classID}>
						{sClass.grade} {sClass.className}
					</option>
				);
			});
	}

	function displaySubjects() {
		const subjects = data.allSubjects;

		return subjects.map((subject) => {
			return (
				<option key={subject._id} value={subject.subjectName}>
					{subject.subjectName}
				</option>
			);
		});
	}

	return (
		<StyledMain>
			<h2>Register Assessment</h2>
			<NewAssessmentFormStyle
				onSubmit={(e) => {
					e.preventDefault();
					registerAssessment();
				}}
			>
				<label>
					Assessment Date:
					<input
						required
						type='date'
						onChange={(e) => {
							setNewEntryData({
								...newEntryData,
								assessmentDate: e.target.value,
							});
							setTerm(getTerm(e.target.value));
						}}
					/>
				</label>
				<label>
					Class:
					<select
						required
						onChange={(e) =>
							setNewEntryData({ ...newEntryData, gradeClass: e.target.value })
						}
					>
						<option value=''>-</option>
						{displayClasses()}
					</select>
				</label>
				<label>
					Subject:
					<select
						required
						onChange={(e) =>
							setNewEntryData({ ...newEntryData, subject: e.target.value })
						}
					>
						<option value=''>-</option>
						{displaySubjects()}
					</select>
				</label>
				<label className='select-period'>
					Periods (Ctrl + click to select multiple):
					<select
						required
						multiple
						onChange={(e) => {
							let selectedOpts = [...e.target.options]
								.filter((x) => x.selected)
								.map((opt) => opt.value)
								.join();

							setNewEntryData({
								...newEntryData,
								period: selectedOpts,
							});
						}}
					>
						<option value='1st'>1st</option>
						<option value='2nd'>2nd</option>
						<option value='3rd'>3rd</option>
						<option value='4th'>4th</option>
						<option value='5th'>5th</option>
						<option value='6th'>6th</option>
						<option value='7th'>7th</option>
						<option value='8th'>8th</option>
					</select>
				</label>
				<label className='markings'>
					Markings:
					<input
						required
						onChange={(e) =>
							setNewEntryData({ ...newEntryData, markings: e.target.value })
						}
						min='0'
						type='number'
					/>
				</label>

				<div className='btn-group'>
					<button className='save-btn'>SAVE</button>
					<button
						onClick={() => props.history.push(`/staff/assessments`)}
						className='cancel-btn'
					>
						CANCEL
					</button>
				</div>
			</NewAssessmentFormStyle>
		</StyledMain>
	);
}

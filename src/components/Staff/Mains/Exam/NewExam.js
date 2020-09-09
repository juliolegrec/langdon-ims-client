import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import styled from 'styled-components';

const NewExamStyled = styled.form`
	padding: 20px 10px;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 10px;

	label {
		input,
		select {
			font-size: 1.25rem;
			width: 100%;
		}
		input[type='checkbox'] {
			width: auto;
			margin-right: 5px;
		}
	}

	.btn-group {
		height: 50%;
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		grid-column-start: 3;
		grid-column-end: 5;
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

export default function NewExam(props) {
	const [newEntryData, setNewEntryData] = useState({});
	const [term, setTerm] = useState();
	console.log(newEntryData);
	console.log(term);

	const REGISTER_EXAM = gql`
		mutation {
			registerExam(
				examInput: {
					examDate: "${newEntryData.examDate}"
					startTime: "${newEntryData.startTime}"
					duration: ${newEntryData.duration}
					subject: "${newEntryData.subject}"
					gradeClass: "${newEntryData.gradeClass}"
					term: "${term}"
					markings: ${newEntryData.markings}
				}
			) {
				examID
			}
		}
	`;

	const [registerExam] = useMutation(REGISTER_EXAM, {
		onCompleted: () => {
			props.history.push('/staff/finalexams');
		},
	});

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	if (loading) {
		return 'Loading...';
	}
	if (error) {
		return 'Error!';
	}

	function getTerm(examDate) {
		const terms = data.allSchoolTerms;
		const selectedDate = new Date(examDate);

		const filteredTerms = terms.filter((term) => {
			const beginDate = new Date(term.beginDate);
			const endDate = new Date(term.endDate);
			return selectedDate >= beginDate && selectedDate <= endDate;
		});

		if (examDate !== undefined) {
			return filteredTerms[0].termName;
		}
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
			<h2>Register Exam</h2>
			<NewExamStyled
				onSubmit={(e) => {
					e.preventDefault();
					registerExam();
				}}
			>
				<label>
					Exam Date:
					<input
						required
						type='date'
						onChange={(e) => {
							setNewEntryData({
								...newEntryData,
								examDate: e.target.value,
							});
							setTerm(getTerm(e.target.value));
						}}
					/>
				</label>
				<label>
					Start Time:
					<input
						required
						type='time'
						onChange={(e) => {
							setNewEntryData({
								...newEntryData,
								startTime: e.target.value,
							});
						}}
					/>
				</label>
				<label>
					Duration:
					<input
						required
						type='number'
						onChange={(e) => {
							setNewEntryData({
								...newEntryData,
								duration: parseInt(e.target.value),
							});
						}}
					/>
				</label>
				<label className='markings'>
					Markings:
					<input
						required
						onChange={(e) =>
							setNewEntryData({
								...newEntryData,
								markings: parseInt(e.target.value),
							})
						}
						min='0'
						type='number'
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

				<div className='btn-group'>
					<button className='save-btn'>SAVE</button>
					<button
						onClick={() => props.history.push(`/staff/assessments`)}
						className='cancel-btn'
					>
						CANCEL
					</button>
				</div>
			</NewExamStyled>
		</StyledMain>
	);
}

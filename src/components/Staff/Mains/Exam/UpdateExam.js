import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import styled from 'styled-components';
import moment from 'moment';

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

export default function UpdateExam(props) {
	const [updatedInfo, setUpdatedInfo] = useState({
		examDate: null,
		startTime: null,
		duration: null,
		markings: null,
		gradeClass: null,
		subject: null,
		term: null,
	});

	console.log(updatedInfo);

	const selectedExam = props.match.params.id;

	const UPDATE_EXAM_INFO = gql`
		mutation (
			$examDate: DateTime,
			$startTime: String
			$duration: Int,
			$markings: Int,
			$gradeClass: String,
			$subject: String,
			$term: String,
			) {
				updateExam(
					_id: "${selectedExam}"
					examDate: $examDate 
					startTime: $startTime
					duration: $duration
					markings: $markings
					gradeClass: $gradeClass
					subject: $subject
					term: $term
				) {
					_id
				}
		}
	`;

	const [updateExamInfo] = useMutation(UPDATE_EXAM_INFO, {
		onCompleted: () => {
			props.history.push('/staff/finalexams');
		},
	});

	const GET_EXAM_FROM_ID = gql`
		{
			examFromId(_id: "${selectedExam}") {
				_id
				examID
				examDate
				gradeClass
				subject
				term
				markings
				startTime
				duration
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_INFOS);

	const { loading: loadingExam, error: errorExam, data: dataExam } = useQuery(
		GET_EXAM_FROM_ID
	);

	if (loadingExam) {
		return 'loading';
	}
	if (errorExam) {
		return 'error';
	}
	if (loading) {
		return 'loading';
	}
	if (error) {
		return 'error';
	}

	const selectedExamData = dataExam.examFromId;

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

	if (!selectedExam) {
		return <h1>Error!</h1>;
	}

	return (
		<StyledMain>
			<h2>Update Exam</h2>
			<NewExamStyled
				onSubmit={(e) => {
					e.preventDefault();
					updateExamInfo({
						variables: {
							examDate: updatedInfo.examDate,
							startTime: updatedInfo.startTime,
							duration: updatedInfo.duration,
							markings: updatedInfo.markings,
							gradeClass: updatedInfo.gradeClass,
							subject: updatedInfo.subject,
							term: updatedInfo.term,
						},
					});
				}}
			>
				<label>
					Exam Date:
					<input
						defaultValue={moment(selectedExamData.examDate).format(
							'YYYY-MM-DD'
						)}
						required
						type="date"
						onChange={(e) => {
							setUpdatedInfo({
								...updatedInfo,
								examDate: e.target.value,
								term: getTerm(e.target.value),
							});
						}}
					/>
				</label>
				<label>
					Start Time:
					<input
						defaultValue={selectedExamData.startTime}
						required
						type="time"
						onChange={(e) => {
							setUpdatedInfo({
								...updatedInfo,
								startTime: e.target.value,
							});
						}}
					/>
				</label>
				<label className="duration">
					Duration:
					<input
						type="number"
						min="0"
						defaultValue={selectedExamData.duration}
						required
						onChange={(e) =>
							setUpdatedInfo({
								...updatedInfo,
								duration: parseInt(e.target.value),
							})
						}
					/>
				</label>
				<label className="markings">
					Markings:
					<input
						type="number"
						min="0"
						defaultValue={selectedExamData.markings}
						required
						onChange={(e) =>
							setUpdatedInfo({
								...updatedInfo,
								markings: parseInt(e.target.value),
							})
						}
					/>
				</label>
				<label>
					Class:
					<select
						defaultValue={selectedExamData.gradeClass}
						required
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, gradeClass: e.target.value })
						}
					>
						<option value="">-</option>
						{displayClasses()}
					</select>
				</label>
				<label>
					Subject:
					<select
						defaultValue={selectedExamData.subject}
						required
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, subject: e.target.value })
						}
					>
						<option value="">-</option>
						{displaySubjects()}
					</select>
				</label>

				<div className="btn-group">
					<button className="save-btn">SAVE</button>
					<button
						onClick={() => props.history.push(`/staff/finalexams`)}
						className="cancel-btn"
					>
						CANCEL
					</button>
				</div>
			</NewExamStyled>
		</StyledMain>
	);
}

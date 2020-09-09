import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledMain from '../../styles/MainStyled';
import styled from 'styled-components';

const StyledSubjectForm = styled.div`
	box-sizing: border-box;
	width: 100%;
	background: #f5f5f5;
	padding: 10px;

	form {
		background: #fff;
		padding: 10px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr auto;
		grid-gap: 10px;
		grid-row-gap: 15px;

		label {
			width: 100%;
			flex-grow: 2;

			input,
			select {
				display: inline-block;
				width: 100%;
				margin-top: 10px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;
			}

			&:nth-child(2) {
				grid-row-start: 1;
				grid-row-end: 3;
				grid-column-start: 2;
				grid-column-end: 3;
			}
			input {
				height: 35px;
			}
		}

		label > span {
			font-size: 0.75em;
		}

		button {
			width: 150px;
			height: 35px;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;
			align-self: center;
		}
	}
`;

export default function UpdateSubject(props) {
	const [newSubjectInfo, setNewSubjectInfo] = useState({});

	const selectedSubject = props.match.params.id;

	const GET_ALL_TEACHERS = gql`
		{
			allTeachers {
				_id
				teacherID
				firstName
				lastName
			}
		}
	`;

	const GET_SUBJECT_FROM_ID = gql`
		{
			getSubjectFromID(_id: "${selectedSubject}") {
				_id
				subjectID
				subjectName
				teacherID
			}
		}
  `;

	const {
		loading: loading_teachers,
		error: error_teachers,
		data: data_teachers,
	} = useQuery(GET_ALL_TEACHERS);

	const {
		loading: loading_subject,
		error: error_subject,
		data: data_subject,
	} = useQuery(GET_SUBJECT_FROM_ID);

	const UPDATE_SUBJECT = gql`
		mutation UpdateSubject($teacherID: [String]) {
			updateSubject(
				_id: "${selectedSubject}"
        subjectName: "${newSubjectInfo.subjectName}"
				teacherID: $teacherID
			) {
				_id
				subjectID
				subjectName
				teacherID
			}
		}
  `;

	const [updateSubject] = useMutation(UPDATE_SUBJECT, {
		onCompleted: () => {
			props.history.push('/staff/subjects');
		},
	});

	if (loading_subject) {
		return 'Loading...';
	}
	if (error_subject) {
		return 'Error!';
	}

	const subjectFromID = data_subject.getSubjectFromID;

	function displayTeacherList() {
		if (loading_teachers) return <option>Loading...</option>;
		if (error_teachers) return <option>Error!</option>;

		const teachers = data_teachers.allTeachers;

		return teachers.map((teacher) => {
			return (
				<option key={teacher._id} value={teacher.teacherID}>
					{teacher.firstName} {teacher.lastName}
				</option>
			);
		});
	}

	return (
		<StyledMain>
			<StyledSubjectForm>
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<label>
						Subject Name:
						<input
							type='text'
							defaultValue={subjectFromID.subjectName}
							onChange={(e) => {
								setNewSubjectInfo({
									...newSubjectInfo,
									subjectName: e.target.value,
								});
							}}
						/>
					</label>
					<label>
						Teacher<span>(Control + click to select multiples)</span>:
						<select
							defaultValue={subjectFromID.teacherID}
							onChange={(e) => {
								let selectedOpts = [...e.target.options]
									.filter((x) => x.selected)
									.map((opt) => opt.value);

								setNewSubjectInfo({
									...newSubjectInfo,
									teacherID: selectedOpts,
								});
							}}
							multiple
							size='3'
						>
							{displayTeacherList()}
						</select>
					</label>
					<div>
						<button
							style={{ marginRight: '10px' }}
							onClick={() => {
								updateSubject({
									variables: { teacherID: newSubjectInfo.teacherID },
								});
							}}
						>
							SAVE
						</button>
						<button
							style={{ backgroundColor: '#e74c3c' }}
							onClick={() => {
								props.history.push('/staff/subjects');
							}}
						>
							CANCEL
						</button>
					</div>
				</form>
			</StyledSubjectForm>
		</StyledMain>
	);
}

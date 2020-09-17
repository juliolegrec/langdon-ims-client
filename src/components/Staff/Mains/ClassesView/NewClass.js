import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import Checkbox from './Checkbox';
import styled from 'styled-components';

const StyledNewClassMain = styled.main`
	max-width: 800px;
	margin: 35px auto 25px;
	background: #fff;
	padding: 10px 20px;
	border-radius: 2px;

	h2 {
		margin-bottom: 10px;
	}

	form {
		max-width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 10px;

		fieldset {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		label {
			margin: 5px 0;

			input,
			select {
				margin-top: 10px;
				width: 100%;
				height: 35px;
				font-family: 'Source Sans Pro', sans-serif;
				font-size: 1.1rem;
				border: 1px solid #cccccc;
				border-radius: 3px;
				padding-left: 10px;
			}

			input[type='checkbox'] {
				width: auto;
				height: auto;
				margin: 0 5px;
			}
		}

		button {
			width: 100px;
			margin: 10px 15px 15px 0;
			grid-column-start: 1;
			grid-column-end: 3;
			padding: 10px 15px;
			font-weight: bold;
			border: 1px solid transparent;
			font-size: 1rem;
			background-color: #2ecc71;
			border-radius: 3px;
			color: white;
			cursor: pointer;

			&:nth-child(2) {
				background: #2c3e50;
			}
		}
	}
`;

export default function NewClass(props) {
	const [newClassInfo, setNewClassInfo] = useState({ teacherID: '' });
	const [subjectsState, setSubjectsState] = useState([]);

	console.log(subjectsState);

	const GET_ALL_TEACHERS = gql`
		{
			allTeachers {
				_id
				teacherID
				firstName
				lastName
			}
			allSubjects {
				_id
				subjectID
				subjectName
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_ALL_TEACHERS);

	const CREATE_CLASS = gql`
		mutation {
			createGradeClass(
				gradeClassInput: {
					className: "${newClassInfo.className}"
					grade: "${newClassInfo.grade}"
					capacity: ${newClassInfo.capacity}
					teacherID: "${newClassInfo.teacherID}"
				}
			) {
				_id
				grade
			}
		}
	`;

	const [createClass] = useMutation(CREATE_CLASS);

	// function handleSubjectChange(value) {

	// }

	var updateSubjects = [];
	console.log(updateSubjects);

	// useEffect(() => {
	// 	setSubjectsState(updateSubjects);
	// }, [updateSubjects]);

	function displaySubjectsList() {
		if (loading) return <label>Loading...</label>;
		if (error) return <label>Error!</label>;

		const subjects = data.allSubjects;

		// const update

		return subjects.map((subject) => {
			const subjectState = {
				subjectID: subject.subjectID,
				isChecked: false,
			};

			updateSubjects.push(subjectState);

			return (
				<label key={subject._id}>
					<Checkbox
						type='checkbox'
						value={subject.subjectID}
						// onChange={() => setSubjectsState([...subjectsState, subjectState])}
					/>
					{subject.subjectName}
				</label>
			);
		});
	}

	function displayTeachersList() {
		if (loading) return <option>Loading...</option>;
		if (error) return <option>Error!</option>;

		const teachers = data.allTeachers;

		return teachers.map((teacher) => {
			return (
				<option key={teacher._id} value={teacher.teacherID}>
					{teacher.firstName} {teacher.lastName}
				</option>
			);
		});
	}
	console.log(newClassInfo);
	return (
		<StyledNewClassMain>
			<h2>New Class View</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createClass();
					window.location.href = `/staff/classes`;
				}}
			>
				<label>
					Class Name:
					<input
						type='text'
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, className: e.target.value })
						}
					/>
				</label>
				<label>
					Grade:
					<input
						type='text'
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, grade: e.target.value })
						}
					/>
				</label>
				<label>
					Capacity:
					<input
						type='text'
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, capacity: e.target.value })
						}
					/>
				</label>
				<fieldset>
					<legend>Subjects:</legend>
					<label>
						<input type='checkbox' />
						<strong>Select All</strong>
					</label>
					{displaySubjectsList()}
				</fieldset>
				<label>
					Teacher in Charge:
					<select
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, teacherID: e.target.value })
						}
					>
						<option value=''></option>
						{displayTeachersList()}
					</select>
				</label>
				<div id='btn-group'>
					<button>Save</button>
					<button onClick={() => props.history.push(`/staff/classes`)}>
						Back
					</button>
				</div>
			</form>
		</StyledNewClassMain>
	);
}

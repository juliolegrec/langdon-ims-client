import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
// import Checkbox from './Checkbox';
import StyledNewClassMain from './styles/StyledNewClassMain';

export default function NewClass(props) {
	const [newClassInfo, setNewClassInfo] = useState({
		teacherID: '',
		subjects: [],
	});

	console.log(newClassInfo);

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
		mutation CreateGradeClass($subjects: [String]) {
			createGradeClass(
				gradeClassInput: {
					className: "${newClassInfo.className}"
					grade: "${newClassInfo.grade}"
					capacity: ${newClassInfo.capacity}
					teacherID: "${newClassInfo.teacherID}"
					subjects: $subjects
				}
			) {
				_id
				grade
			}
		}
	`;

	const [createClass] = useMutation(CREATE_CLASS);

	function addSubjectToState(subject) {
		const existingSubjectID = newClassInfo.subjects.find(
			(element) => element === subject.subjectID
		);

		if (!existingSubjectID) {
			newClassInfo.subjects.push(subject.subjectID);
		} else {
			const subjectIndex = newClassInfo.subjects.findIndex(
				(element) => element === subject.subjectID
			);

			newClassInfo.subjects.splice(subjectIndex, 1, subject.subjectID);
		}
	}
	function removeSubjectFromState(subject) {
		const existingSubjectID = newClassInfo.subjects.find(
			(element) => element === subject.subjectID
		);

		if (!existingSubjectID) {
			// newClassInfo.subjects.push(subject.subjectID);

			console.log('teset');
		} else {
			const subjectIndex = newClassInfo.subjects.findIndex(
				(element) => element === subject.subjectID
			);

			newClassInfo.subjects.splice(subjectIndex, 1);
		}
	}

	function displaySubjectsList() {
		if (loading) return <label>Loading...</label>;
		if (error) return <label>Error!</label>;

		const subjects = data.allSubjects;

		return subjects.map((subject) => {
			return (
				<label key={subject._id}>
					<input
						type="checkbox"
						value={subject.subjectID}
						onChange={(e) =>
							e.target.checked
								? addSubjectToState(subject)
								: removeSubjectFromState(subject)
						}
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

	return (
		<StyledNewClassMain>
			<h2>New Class View</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createClass({
						variables: {
							subjects: [...newClassInfo.subjects],
						},
					});
					window.location.href = `/staff/classes`;
				}}
			>
				<label>
					Grade:
					<input
						type="text"
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, grade: e.target.value })
						}
					/>
				</label>
				<label>
					Class Name:
					<input
						type="text"
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, className: e.target.value })
						}
					/>
				</label>
				<label>
					Capacity:
					<input
						type="text"
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, capacity: e.target.value })
						}
					/>
				</label>
				<fieldset>
					<legend>Subjects:</legend>
					{/* <label>
						<input
							type='checkbox'
							// onChange={(e) => setSelectAll(!selectAll)}
						/>
						<strong>Select All</strong>
					</label> */}
					{displaySubjectsList()}
				</fieldset>
				<label>
					Teacher in Charge:
					<select
						onChange={(e) =>
							setNewClassInfo({ ...newClassInfo, teacherID: e.target.value })
						}
					>
						<option value=""></option>
						{displayTeachersList()}
					</select>
				</label>
				<div id="btn-group" style={{ marginTop: '18px' }}>
					<button>Save</button>
					<button onClick={() => props.history.push(`/staff/classes`)}>
						Back
					</button>
				</div>
			</form>
		</StyledNewClassMain>
	);
}

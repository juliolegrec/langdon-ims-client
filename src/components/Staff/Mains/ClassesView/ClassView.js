import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import StyledNewClassMain from './styles/StyledNewClassMain';

export default function ClassView(props) {
	const [updatedInfo, setUpdatedInfo] = useState({
		className: null,
		grade: null,
		capacity: null,
		teacherID: null,
		subjects: null,
	});
	const [isEditable, setIsEditable] = useState(false);

	const selectedClass = props.match.params.id;

	const GET_ALL_INFO = gql`
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

	const { loading, error, data } = useQuery(GET_ALL_INFO);

	const UPDATE_CLASS = gql`
		mutation (
		  $className: String
		  $grade: String
		  $capacity: Int
		  $teacherID: String
			$subjects: [String]
    ) {
			updateClass(
          _id: "${selectedClass}"
					className: $className
					grade: $grade
					capacity: $capacity
					teacherID: $teacherID
					subjects: $subjects
			) {
				_id
			}
		}
	`;

	const [updateClassInfo] = useMutation(UPDATE_CLASS, {
		onCompleted: () => {
			props.history.push('/staff/classes');
		},
	});

	const GET_CLASS_FROM_ID = gql`
    {
      classFromId(_id: "${selectedClass}"){
      className
      grade
      capacity
      teacherID
			subjects
    }
  }
  `;

	const {
		loading: loadingClass,
		error: errorClass,
		data: dataClass,
	} = useQuery(GET_CLASS_FROM_ID);

	useEffect(() => {
		setUpdatedInfo({
			className: dataClass && dataClass.classFromId.className,
			grade: dataClass && dataClass.classFromId.grade,
			capacity: dataClass && dataClass.classFromId.capacity,
			teacherID: dataClass && dataClass.classFromId.teacherID,
			subjects: dataClass && dataClass.classFromId.subjects,
		});
	}, [dataClass]);

	console.log(updatedInfo);

	function addSubjectToState(subject) {
		const existingSubjectID = updatedInfo.subjects.find(
			(element) => element === subject.subjectID
		);

		if (!existingSubjectID) {
			updatedInfo.subjects.push(subject.subjectID);
			setUpdatedInfo(updatedInfo);
		} else {
			const subjectIndex = updatedInfo.subjects.findIndex(
				(element) => element === subject.subjectID
			);

			updatedInfo.subjects.splice(subjectIndex, 1, subject.subjectID);

			setUpdatedInfo(updatedInfo);
		}
	}
	function removeSubjectFromState(subject) {
		const existingSubjectID = updatedInfo.subjects.find(
			(element) => element === subject.subjectID
		);

		if (!existingSubjectID) {
			// updatedInfo.subjects.push(subject.subjectID);

			setUpdatedInfo(updatedInfo);
		} else {
			const subjectIndex = updatedInfo.subjects.findIndex(
				(element) => element === subject.subjectID
			);

			updatedInfo.subjects.splice(subjectIndex, 1);
			setUpdatedInfo(updatedInfo);
		}
	}

	if (loadingClass) {
		return 'Loading...';
	}
	if (errorClass) {
		return 'Error...';
	}

	const selectedClassData = dataClass.classFromId;

	function displaySubjectsList() {
		if (loading) return <label>Loading...</label>;
		if (error) return <label>Error!</label>;

		const subjects = data.allSubjects;

		return subjects.map((subject) => {
			const existingSubject = selectedClassData.subjects.find(
				(element) => element === subject.subjectID
			);
			return (
				<label
					key={subject._id}
					className={!existingSubject && !isEditable ? 'hide' : ''}
				>
					<input
						type="checkbox"
						className={existingSubject && !isEditable ? 'hide' : ''}
						defaultChecked={existingSubject ? 'checked' : ''}
						disabled={isEditable ? '' : 'disabled'}
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

	function saveToDB() {
		setIsEditable(false);
	}

	function cancelModif() {
		setIsEditable(false);
	}
	return (
		<StyledNewClassMain>
			<h2>
				Class View
				{isEditable ? (
					<>
						<span
							className="saveBtn"
							onClick={() => {
								// updateInfo();
								saveToDB();
								// loadingPhotoPic();
							}}
						>
							save
						</span>
						<span
							className="cancelBtn"
							onClick={() => {
								cancelModif();
							}}
						>
							cancel
						</span>
					</>
				) : (
					<span className="editBtn" onClick={() => setIsEditable(true)}>
						edit
					</span>
				)}
			</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();

					// window.location.href = `/staff/classes`;
				}}
			>
				<label>
					<strong>Grade:</strong>
					<input
						type="text"
						disabled={isEditable ? '' : 'disabled'}
						defaultValue={updatedInfo.grade}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, grade: e.target.value })
						}
					/>
				</label>
				<label>
					<strong>Class Name:</strong>
					<input
						type="text"
						disabled={isEditable ? '' : 'disabled'}
						defaultValue={updatedInfo.className}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, className: e.target.value })
						}
					/>
				</label>

				<label>
					<strong>Capacity:</strong>
					<input
						type="text"
						disabled={isEditable ? '' : 'disabled'}
						defaultValue={updatedInfo.capacity}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, capacity: e.target.value })
						}
					/>
				</label>
				<fieldset>
					<legend>Subjects:</legend>
					{displaySubjectsList()}
				</fieldset>
				<label>
					<strong>Teacher in Charge:</strong>
					<select
						defaultValue={selectedClassData.teacherID}
						disabled={isEditable ? '' : 'disabled'}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, teacherID: e.target.value })
						}
					>
						<option value=""></option>
						{displayTeachersList()}
					</select>
				</label>
				<div id="btn-group" style={{ marginTop: '18px' }}>
					<button
						onClick={() => {
							saveToDB();
							updateClassInfo({
								variables: {
									className: updatedInfo.className,
									grade: updatedInfo.grade,
									capacity: updatedInfo.capacity,
									teacherID: updatedInfo.teacherID,
									subjects: [...updatedInfo.subjects],
								},
							});
						}}
					>
						Save
					</button>
					<button onClick={() => props.history.push(`/staff/classes`)}>
						Back
					</button>
				</div>
			</form>
		</StyledNewClassMain>
	);
}

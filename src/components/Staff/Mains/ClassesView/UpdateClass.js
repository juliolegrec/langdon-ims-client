import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
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
		grid-template-columns: 1fr 1fr;
		grid-gap: 10px;

		label {
			margin-bottom: 15px;

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

export default function UpdateClass(props) {
	const [updatedInfo, setUpdatedInfo] = useState({
		className: null,
		grade: null,
		capacity: null,
		teacherID: null,
	});

	const selectedClass = props.match.params.id;

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

	const { loading, error, data } = useQuery(GET_ALL_TEACHERS);

	const UPDATE_CLASS = gql`
		mutation (
		  $className: String
		  $grade: String
		  $capacity: Int
		  $teacherID: String
    ) {
			updateClass(
          _id: "${selectedClass}"
					className: $className
					grade: $grade
					capacity: $capacity
					teacherID: $teacherID
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
    }
  }
  `;

	const {
		loading: loadingClass,
		error: errorClass,
		data: dataClass,
	} = useQuery(GET_CLASS_FROM_ID);

	if (loadingClass) {
		return 'Loading...';
	}
	if (errorClass) {
		return 'Error...';
	}

	const selectedClassData = dataClass.classFromId;

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
	console.log(updatedInfo);
	return (
		<StyledNewClassMain>
			<h2>New Class View</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					updateClassInfo({
						variables: {
							className: updatedInfo.className,
							grade: updatedInfo.grade,
							capacity: updatedInfo.capacity,
							teacherID: updatedInfo.teacherID,
						},
					});
					// window.location.href = `/staff/classes`;
				}}
			>
				<label>
					Class Name:
					<input
						type='text'
						defaultValue={selectedClassData.className}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, className: e.target.value })
						}
					/>
				</label>
				<label>
					Grade:
					<input
						type='text'
						defaultValue={selectedClassData.grade}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, grade: e.target.value })
						}
					/>
				</label>
				<label>
					Capacity:
					<input
						type='text'
						defaultValue={selectedClassData.capacity}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, capacity: e.target.value })
						}
					/>
				</label>
				<label>
					Teacher in Charge:
					<select
						defaultValue={selectedClassData.teacherID}
						onChange={(e) =>
							setUpdatedInfo({ ...updatedInfo, teacherID: e.target.value })
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

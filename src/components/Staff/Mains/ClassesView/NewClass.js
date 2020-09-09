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

function NewClass(props) {
	const [newClassInfo, setNewClassInfo] = useState({ teacherID: '' });

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

	// className, grade, capacity, teacherID

	function displayTeachersList() {
		if (loading) return <option>Loading...</option>;
		if (error) return <option>Error!</option>;

		const teachers = data.allTeachers;

		return teachers.map(teacher => {
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
				onSubmit={e => {
					e.preventDefault();
					createClass();
					window.location.href = `/staff/classes`;
				}}
			>
				<label>
					Class Name:
					<input
						type="text"
						onChange={e =>
							setNewClassInfo({ ...newClassInfo, className: e.target.value })
						}
					/>
				</label>
				<label>
					Grade:
					<input
						type="text"
						onChange={e =>
							setNewClassInfo({ ...newClassInfo, grade: e.target.value })
						}
					/>
				</label>
				<label>
					Capacity:
					<input
						type="text"
						onChange={e =>
							setNewClassInfo({ ...newClassInfo, capacity: e.target.value })
						}
					/>
				</label>
				<label>
					Teacher in Charge:
					<select
						onChange={e =>
							setNewClassInfo({ ...newClassInfo, teacherID: e.target.value })
						}
					>
						<option value=""></option>
						{displayTeachersList()}
					</select>
				</label>
				<div id="btn-group">
					<button>Save</button>
					<button onClick={() => props.history.push(`/staff/classes`)}>
						Back
					</button>
				</div>
			</form>
		</StyledNewClassMain>
	);
}

export default NewClass;

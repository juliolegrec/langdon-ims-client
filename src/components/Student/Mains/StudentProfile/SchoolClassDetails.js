import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import moment from 'moment';

function SchoolClassDetails(props) {
	const { classDetails } = props.data.findStudentFromUsername;
	const [editable, setEditable] = useState(false);

	const [classInfo, setClassInfo] = useState({
		grade: classDetails.grade,
		classID: classDetails.classID,
		className: classDetails.className,
	});

	function SaveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	const UPDATE_STUDENT_CLASS_INFO = gql`
		mutation {
			updateStudentClassInfo(
				_id: "${props.studentID}"
				classID: "${classInfo.classID}"
			) {
				_id
				firstName
				lastName
				classID
			}
		}
	`;

	const [updateClassInfo] = useMutation(UPDATE_STUDENT_CLASS_INFO);

	const GET_ALL_CLASSES = gql`
		{
			allClasses {
				_id
				classID
				className
				grade
			}
		}
	`;

	const {
		loading: loadingClasses,
		error: errorClasses,
		data: dataClasses,
	} = useQuery(GET_ALL_CLASSES);

	function displayAllClasses(studentGrade) {
		if (loadingClasses) return 'Loading...';
		if (errorClasses) return 'Error!';

		const classes = dataClasses.allClasses;

		const distinctGrades = [
			...new Set(classes.map((x) => parseInt(x.grade))),
		].sort((a, b) => a - b);

		if (editable) {
			return distinctGrades.map((grade) => {
				return (
					<option key={grade} value={grade}>
						{grade}
					</option>
				);
			});
		}
	}

	function classesNames(x) {
		if (loadingClasses) return 'Loading...';
		if (errorClasses) return 'Error!';

		const classes = dataClasses.allClasses;

		if (x) {
			const classNameFromGrade = classes.filter((sClass) => sClass.grade === x);
			return classNameFromGrade.map((sClassName) => {
				return (
					<option key={sClassName._id} value={sClassName.classID}>
						{sClassName.className}
					</option>
				);
			});
		}

		console.log(classes);
	}

	return (
		<section>
			<h2>School &amp; Class Details </h2>
			<form>
				<label>
					Enrollment Date:
					<input
						type='date'
						disabled
						value={moment(
							props.data.findStudentFromUsername.enrollmentDate
						).format('YYYY-MM-DD')}
					/>
				</label>
				<label>
					Current Grade:
					{editable ? (
						<select
							defaultValue={classInfo.grade}
							onChange={(e) =>
								setClassInfo({ ...classInfo, grade: e.target.value })
							}
						>
							{displayAllClasses(classInfo.grade)}
						</select>
					) : (
						<input type='text' disabled value={classInfo.grade} />
					)}
				</label>
				<label>
					Current Class:
					{editable ? (
						<select
							defaultValue={classInfo.className}
							onChange={(e) => {
								console.log();
								setClassInfo({
									...classInfo,
									classID: e.target.value,
									className: e.target.options[e.target.selectedIndex].text,
								});
							}}
						>
							<option value=''>-</option>
							{classesNames(classInfo.grade)}
						</select>
					) : (
						<input type='text' disabled value={classInfo.className} />
					)}
				</label>
			</form>
		</section>
	);
}

export default SchoolClassDetails;

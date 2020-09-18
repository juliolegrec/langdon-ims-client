import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import StyledMain from '../styles/MainStyled';

export default function AssessmentMarks() {
	const pageTitle = 'My Assessments Marks';

	let state = JSON.parse(localStorage.getItem('state'));
	let { username } = state.sessionState.authUser;

	const STUDENT_INFO = gql`
	{
			allAssessmentsMarks {
				_id
				assessmentID
				studentMarks {
					studentID
					markings
				}
				assessmentInfo{
					_id
					assessmentDate
					gradeClass
					subject
					term
					markings
				}
			}
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
			findStudentFromUsername(username: "${username}"){
				_id
				studentID
				classDetails {
					_id
					classID
					className
					grade
				}
			}
	}
	`;

	const { loading, error, data } = useQuery(STUDENT_INFO);

	function displayAssessment() {
		if (loading) {
			return <p>loading...</p>;
		}
		if (error) {
			return <p>error...</p>;
		}

		const assessmentMarks = data?.allAssessmentsMarks;
		const studentInfo = data?.findStudentFromUsername;

		const selectedAssessmentsMarks = [];

		assessmentMarks.forEach((mark) => {
			// console.log(mark);
			mark.studentMarks.forEach((studentMark) => {
				const student = studentMark?.studentID === studentInfo?.studentID;

				if (student) {
					selectedAssessmentsMarks.push({
						...studentMark,
						...mark.assessmentInfo,
					});
				}
			});
		});

		// console.log(selectedAssessmentsMarks);

		const info = [];

		selectedAssessmentsMarks.map((element) =>
			info.push({
				date: element[0].assessmentDate,
				term: element[0].term,
				subject: element[0].subject,
				markings: element.markings,
			})
		);

		console.log(info);
	}
	displayAssessment();
	// console.log(data?.allAssessmentsMarks);

	return (
		<StyledMain>
			<h2>{pageTitle}</h2>
		</StyledMain>
	);
}

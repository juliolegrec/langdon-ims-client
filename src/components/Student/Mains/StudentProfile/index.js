import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import PersonalDetails from './PersonalDetails';
import GuardianDetails from './GuardianDetails';
import SchoolClassDetails from './SchoolClassDetails';
import PasswordChanger from './PasswordChanger';
import { capitalize } from '../../../../helpers';
import PersonViewStyled from '../../styles/PersonViewStyled';
// import PrintTemplate from 'react-print';
// import PrintHeader from '../../../PrintHeader';
import TitleStyled from '../../styles/TitleStyled';

export default function StudentProfile() {
	let state = JSON.parse(localStorage.getItem('state'));
	let { username } = state.sessionState.authUser;

	const STUDENT_INFO = gql`
	{
		findStudentFromUsername(username: "${username}")	{
			_id
			studentID
			firstName
			lastName
			gender
			dob
			streetAddress
			city
			zipCode
			classID
			telephoneNumber
			emailAddress
			profilePic
			classDetails {
				_id
				className
				grade
				classID
			}
			guardianDetails {
				_id
				firstName
				lastName
				relationship
				mobilePhone
				workPhone
				emailAddress
			}
			enrollmentDate
		}
	}
	`;

	const { loading, error, data } = useQuery(STUDENT_INFO);

	const [editable, setEditable] = useState(false);
	const [, setStudentID] = useState('');
	const [studentName, setStudentName] = useState({});

	// const pageTitle = 'My Student Profile';

	useEffect(() => {
		setStudentName({
			firstName: data && data.findStudentFromUsername.firstName,
			lastName: data && data.findStudentFromUsername.lastName,
		});
		setStudentID(data && data.findStudentFromUsername.studentID);
	}, [data]);

	const UPDATE_STUDENT_NAME = gql`
		mutation {
			updateStudentPersoInfo(
				_id: "${username}"
				firstName: "${capitalize(studentName.firstName)}"
				lastName: "${studentName.lastName}"
			) {
				_id
			}
		}
	`;

	const [updateNameInfo] = useMutation(UPDATE_STUDENT_NAME);

	if (loading) return <h1>Loading...</h1>;
	if (error) {
		console.log(error);
		return <h1>`Error! ${error.message}`</h1>;
	}

	function SaveToDB() {
		setEditable(false);
	}

	function cancelModif() {
		setEditable(false);
	}

	return (
		<PersonViewStyled>
			<TitleStyled id="react-no-print">
				<button onClick={() => window.print()}>PRINT</button>
			</TitleStyled>
			<div className="person-header">
				<h1 className="person-name">
					{!editable ? (
						<span id="firstName">{studentName.firstName} </span>
					) : (
						<div id="firstName">
							<label>First Name:</label>
							<input
								data-content="First Name"
								className={editable ? 'editable' : ''}
								type="text"
								value={studentName.firstName}
								onChange={(e) => {
									setStudentName({
										...studentName,
										firstName: capitalize(e.target.value),
									});
								}}
							/>
						</div>
					)}
					{!editable ? (
						<span id="lastName">{studentName.lastName} </span>
					) : (
						<div id="lastName">
							<label>Last Name:</label>
							<input
								data-content="Last Name"
								className={editable ? 'editable' : ''}
								type="text"
								value={studentName.lastName}
								onChange={(e) => {
									setStudentName({
										...studentName,
										lastName: capitalize(e.target.value),
									});
								}}
							/>
						</div>
					)}
					<span id="studentID">
						&#40;{data.findStudentFromUsername.studentID}&#41;
					</span>
					{editable ? (
						<>
							<span
								id="react-no-print"
								className="saveBtn"
								onClick={(e) => {
									updateNameInfo();
									SaveToDB();
								}}
							>
								save
							</span>
							<span
								id="react-no-print"
								className="cancelBtn"
								onClick={() => cancelModif()}
							>
								cancel
							</span>
						</>
					) : (
						<span
							id="react-no-print"
							className="editBtn"
							onClick={() => setEditable(true)}
						>
							edit
						</span>
					)}
				</h1>
			</div>
			<PersonalDetails data={data} studentID={data._id} />

			<GuardianDetails data={data} />
			<SchoolClassDetails data={data} studentID={data._id} />
			<PasswordChanger />
		</PersonViewStyled>
	);
}

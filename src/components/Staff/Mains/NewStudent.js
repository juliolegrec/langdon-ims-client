import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import RegistrationStyled from '../styles/RegistrationStyled';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import PrintTemplate from 'react-print';
import PrintHeader from '../../PrintHeader';
import TitleStyled from '../styles/TitleStyled';

const StyledDialog = styled.div`
	width: 100%;

	h3 {
		text-align: center;
		margin-bottom: 10px;
	}
`;

export default function NewStudent(props) {
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

	const [open, setOpen] = useState(false);
	const [newStudent, setNewStudent] = useState({});
	const [newGuardian, setNewGuardian] = useState({});

	const pageTitle = 'Student Registration';

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const currentDate = moment().toISOString();

	const CREATE_STUDENT = gql`
		mutation RegisterStudent($profilePic: Upload!) {
			registerStudent (
				studentInput: {
					firstName: "${newStudent.firstName}"
					lastName: "${newStudent.lastName}"
					gender: "${newStudent.gender}"
					dob: "${newStudent.dob}"
					classID:"${newStudent.classID}"
					streetAddress: "${newStudent.streetAddress}"
					city: "${newStudent.city}"
					zipCode: "${newStudent.zipCode}"
					telephoneNumber: "${newStudent.telephoneNumber}"
					emailAddress: "${newStudent.emailAddress}"
					enrollmentDate: "${currentDate}"
					profilePic: $profilePic
				}
				guardianInput: {
					guardianFirstName: "${newGuardian.firstName}"
					guardianLastName: "${newGuardian.lastName}"
					guardianRelationship: "${newGuardian.relationship}"
					guardianMobilePhone: "${newGuardian.mobilePhone}"
					guardianWorkPhone: "${newGuardian.workPhone}"
					guardianEmailAddress: "${newGuardian.emailAddress}"
				}
			) {
				_id
			}
		}
	`;

	const [registerStudent] = useMutation(CREATE_STUDENT);

	function goToStudentsView() {
		// window.location.href = '/staff/students';
		props.history.push('/staff/students');
	}

	function goToNewStudentView() {
		window.location.href = '/staff/students/register-student';
	}

	function displayAllClasses() {
		if (loadingClasses) return 'Loading...';
		if (errorClasses) return 'Error!';

		const classes = dataClasses.allClasses;

		const distinctGrades = [
			...new Set(classes.map((x) => parseInt(x.grade))),
		].sort((a, b) => a - b);

		return distinctGrades.map((grade) => {
			return (
				<option key={grade} value={grade}>
					{grade}
				</option>
			);
		});
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
	}

	function displayRegistrationForm() {
		return (
			<form
				autoComplete='off'
				onSubmit={(e) => {
					e.preventDefault();
					registerStudent({ variables: { profilePic: newStudent.profilePic } });
					handleClickOpen();
				}}
			>
				<fieldset className='student-details'>
					<legend>Student Personal Details</legend>
					<label>
						First Name:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, firstName: e.target.value })
							}
						/>
					</label>
					<label>
						Last Name:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, lastName: e.target.value })
							}
						/>
					</label>
					<label>
						Gender:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, gender: e.target.value })
							}
						/>
					</label>
					<label>
						Date of Birth:
						<input
							required
							type='date'
							onChange={(e) =>
								setNewStudent({ ...newStudent, dob: e.target.value })
							}
						/>
					</label>
					<label>
						Street Address:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, streetAddress: e.target.value })
							}
						/>
					</label>
					<label>
						City:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, city: e.target.value })
							}
						/>
					</label>
					<label>
						Zip Code:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, zipCode: e.target.value })
							}
						/>
					</label>
					<label>
						Telephone Number:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({
									...newStudent,
									telephoneNumber: e.target.value,
								})
							}
						/>
					</label>
					<label>
						Email Address:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewStudent({ ...newStudent, emailAddress: e.target.value })
							}
						/>
					</label>
					<label id='react-no-print'>
						Photo upload:
						<input
							type='file'
							onChange={(e) =>
								setNewStudent({ ...newStudent, profilePic: e.target.files[0] })
							}
						/>
					</label>
				</fieldset>
				<fieldset className='guardian-details'>
					<legend>Guardian Details</legend>
					<label>
						First Name:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewGuardian({ ...newGuardian, firstName: e.target.value })
							}
						/>
					</label>
					<label>
						Last Name:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewGuardian({ ...newGuardian, lastName: e.target.value })
							}
						/>
					</label>
					<label>
						Relationship:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewGuardian({ ...newGuardian, relationship: e.target.value })
							}
						/>
					</label>
					<label>
						Mobile Phone:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewGuardian({ ...newGuardian, mobilePhone: e.target.value })
							}
						/>
					</label>
					<label>
						Work Phone:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewGuardian({ ...newGuardian, workPhone: e.target.value })
							}
						/>
					</label>
					<label>
						Email Address:
						<input
							required
							type='text'
							onChange={(e) =>
								setNewGuardian({ ...newGuardian, emailAddress: e.target.value })
							}
						/>
					</label>
				</fieldset>
				<fieldset className='class-details'>
					<legend>Class Details</legend>
					<label>
						Grade:
						<select
							onChange={(e) =>
								setNewStudent({ ...newStudent, grade: e.target.value })
							}
						>
							<option value=''>-</option>
							{displayAllClasses()}
						</select>
					</label>
					<label>
						Class Name:
						<select
							required
							onChange={(e) =>
								setNewStudent({ ...newStudent, classID: e.target.value })
							}
						>
							<option value=''>-</option>
							{classesNames(newStudent.grade)}
						</select>
					</label>
				</fieldset>
				<div className='form-buttons' id='react-no-print'>
					<button type='submit' value='Submit'>
						SAVE
					</button>
					<button onClick={() => goToStudentsView()}>CANCEL</button>
				</div>
			</form>
		);
	}

	return (
		<div>
			<RegistrationStyled style={{ position: 'relative' }} id='react-no-print'>
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				{displayRegistrationForm()}
				<Dialog open={open} onClose={handleClose}>
					<DialogContent>
						<StyledDialog>
							<h3>Student Registered Successfully!</h3>
							<Button color='primary' onClick={() => goToNewStudentView()}>
								Register Another Student
							</Button>
							<Button onClick={() => goToStudentsView()}>
								Go Back to Students List
							</Button>
						</StyledDialog>
					</DialogContent>
				</Dialog>
			</RegistrationStyled>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<RegistrationStyled>{displayRegistrationForm()}</RegistrationStyled>
			</PrintTemplate>
		</div>
	);
}

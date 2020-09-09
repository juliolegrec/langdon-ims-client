import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import TeacherRegistrationStyled from '../styles/TeacherRegistrationStyled';
import styled from 'styled-components';
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

const LoadingImage = styled.div`
	position: absolute;
	width: calc(100vw - 250px);
	height: 100%;
	background: white;
	display: flex;
	justify-content: center;
	opacity: 0.75;

	img {
		margin-top: 75px;
	}
`;

export default function NewTeacher(props) {
	const [newTeacher, setNewTeacher] = useState({});
	const [loadingActive, setLoadingActive] = useState(false);
	const [open, setOpen] = useState(false);

	const pageTitle = 'Teacher Registration';

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const CREATE_TEACHER = gql`
		mutation CreateTeacher($profilePic: Upload!) {
			createTeacher (
				teacherInput: {
					firstName: "${newTeacher.firstName}"
					lastName: "${newTeacher.lastName}"
					gender: "${newTeacher.gender}"
					dob: "${newTeacher.dob}"
					streetAddress: "${newTeacher.streetAddress}"
					city: "${newTeacher.city}"
					zipCode: "${newTeacher.zipCode}"
					telephoneNumber: "${newTeacher.telephoneNumber}"
					emailAddress: "${newTeacher.emailAddress}"
					profilePic: $profilePic
					enrollmentDate: "${newTeacher.enrollmentDate}" 
				}
			) {
				_id
			}
		}
	`;

	const [registerTeacher] = useMutation(CREATE_TEACHER, {
		onCompleted: () => {
			setLoadingActive(false);
			// window.location.href = '/staff/teachers';
			handleClickOpen();
		},
	});

	function goToStudentsView() {
		// window.location.href = '/staff/students';
		props.history.push('/staff/teachers');
	}

	function goToNewStudentView() {
		window.location.href = '/staff/teachers/register-teacher';
	}

	function displayRegistrationForm() {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setLoadingActive(true);
					registerTeacher({
						variables: { profilePic: newTeacher.profilePic },
					});
				}}
			>
				<label>
					First Name:
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, firstName: e.target.value })
						}
					/>
				</label>
				<label>
					Last Name:
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, lastName: e.target.value })
						}
					/>
				</label>
				<label>
					Gender:
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, gender: e.target.value })
						}
					/>
				</label>
				<label>
					Date of Birth:
					<input
						required
						type='date'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, dob: e.target.value })
						}
					/>
				</label>
				<label>
					Street Address:
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, streetAddress: e.target.value })
						}
					/>
				</label>
				<label>
					City
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, city: e.target.value })
						}
					/>
				</label>
				<label>
					Zipcode
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, zipCode: e.target.value })
						}
					/>
				</label>
				<label>
					Telephone Number:
					<input
						required
						type='text'
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								telephoneNumber: e.target.value,
							})
						}
					/>
				</label>
				<label>
					Email Address:
					<input
						required
						type='email'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, emailAddress: e.target.value })
						}
					/>
				</label>
				<label>
					Joining Date:
					<input
						required
						type='date'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, enrollmentDate: e.target.value })
						}
					/>
				</label>
				<label>
					Photo:
					<input
						required
						type='file'
						onChange={(e) =>
							setNewTeacher({ ...newTeacher, profilePic: e.target.files[0] })
						}
					/>
				</label>
				<div id='react-no-print' className='form-buttons'>
					<button type='submit' value='Submit'>
						SAVE
					</button>
					<button
						onClick={() => {
							window.location.href = '/staff/teachers';
						}}
					>
						CANCEL
					</button>
				</div>
			</form>
		);
	}

	return (
		<>
			{loadingActive ? (
				<LoadingImage>
					<img
						style={{ position: 'absolute' }}
						src='https://res.cloudinary.com/imperium/image/upload/v1581344084/loading-spinner.gif'
						alt='loading'
					/>
				</LoadingImage>
			) : (
				''
			)}
			<TeacherRegistrationStyled
				style={{ position: 'relative' }}
				id='react-no-print'
			>
				<TitleStyled>
					<button onClick={() => window.print()}>PRINT</button>
				</TitleStyled>
				<h2>{pageTitle}</h2>
				{displayRegistrationForm()}
				<Dialog open={open} onClose={handleClose}>
					<DialogContent>
						<StyledDialog>
							<h3>Teacher Registered Successfully!</h3>
							<Button color='primary' onClick={() => goToNewStudentView()}>
								Register Another Teacher
							</Button>
							<Button onClick={() => goToStudentsView()}>
								Go Back to Teachers List
							</Button>
						</StyledDialog>
					</DialogContent>
				</Dialog>
			</TeacherRegistrationStyled>
			<PrintTemplate>
				<PrintHeader pageTitle={pageTitle} />
				<TeacherRegistrationStyled>
					{displayRegistrationForm()}
				</TeacherRegistrationStyled>
			</PrintTemplate>
		</>
	);
}

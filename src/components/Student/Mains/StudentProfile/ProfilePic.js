import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';

const ProfilePicStyled = styled.div`
	label,
	button,
	input {
		width: 100%;
		cursor: pointer;
	}

	img {
		border: 1px solid transparent;
		border-radius: 5px;
		width: 150px;
	}

	.btn-group {
		width: 100%;
		display: grid;
		grid-gap: 5px;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;

		label {
			grid-column-start: 1;
			grid-column-end: 3;
			position: relative;
			overflow: hidden;
			display: inline-block;

			& > input[type='file'] {
				/* font-size: 100px; */
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				opacity: 0;
				cursor: pointer;
			}
		}
	}
	.save-btn {
		background-color: #2ecc71;
		color: white;
		border: 1px solid #16a085;
		border-radius: 2px;
		font-weight: bold;
	}

	.cancel-btn {
		background-color: #e74c3c;
		color: white;
		border: 1px solid #c0392b;
		border-radius: 2px;
		font-weight: bold;
	}

	.choose-btn {
		background-color: #e67e22;
		border: 1px solid #d35400;
		border-radius: 2px;
		color: white;
		font-weight: bold;
	}
`;

export default function ProfilePic(props) {
	const [isEditable, setIsEditable] = useState(false);
	const [loadingPic, setLoadingPic] = useState(false);
	const [studentProfilePic, setStudentProfilePic] = useState();

	const photo_id = props.data.profilePic
		.split('/')
		.pop()
		.split('.')
		.reverse()
		.pop();

	console.log(props);

	const UPDATE_PROFILE_PIC = gql`
		mutation UpdateStudentProfilePic($profilePic: Upload!) {
			updateStudentProfilePic(
				_id: "${props.studentMongoID}"
				profilePic: $profilePic
				photoID: "${photo_id}"
			) {
				_id
			}
		}
  `;

	const [updatePhoto] = useMutation(UPDATE_PROFILE_PIC, {
		onCompleted() {
			window.location.reload();
		},
	});

	function loadingPhotoPic() {
		setLoadingPic(true);
	}

	return (
		<ProfilePicStyled>
			{!isEditable ? (
				<>
					<img
						id='profile-pic'
						src={
							!loadingPic
								? props.data.profilePic === null
									? 'https://res.cloudinary.com/imperium/image/upload/c_fill,h_200,w_150/v1574791105/nouser.png'
									: props.data.profilePic
								: 'https://res.cloudinary.com/imperium/image/upload/c_fill,h_200,w_150/v1581344084/loading-spinner.gif'
						}
						alt='student'
					/>
					<button
						id='react-no-print'
						className='change-btn'
						onClick={(e) => setIsEditable(true)}
					>
						CHANGE PHOTO
					</button>
				</>
			) : (
				<>
					<img
						id='profile-pic'
						src='https://res.cloudinary.com/imperium/image/upload/c_fill,h_200,w_150/v1574791105/nouser.png'
						alt='student'
					/>
					<div id='react-no-print' className='btn-group'>
						<label>
							<button className='choose-btn'>CHOOSE FILE</button>
							<input
								type='file'
								onChange={(e) => {
									setStudentProfilePic(e.target.files[0]);
								}}
							/>
						</label>

						<button
							className='save-btn'
							onClick={() => {
								updatePhoto({
									variables: { profilePic: studentProfilePic },
								});
								setIsEditable(false);
								loadingPhotoPic();
							}}
						>
							SAVE
						</button>
						<button className='cancel-btn' onClick={() => setIsEditable(false)}>
							CANCEL
						</button>
					</div>
				</>
			)}
		</ProfilePicStyled>
	);
}

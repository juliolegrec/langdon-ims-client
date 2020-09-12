import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { useDispatch } from 'redux-react-hook';
import TimeDay from './TimeDay';
import * as actions from '../constants/actions_types';
import StyledHeader from './styles/StyledHeader';
import styled from 'styled-components';
// import { Image, Transformation } from 'cloudinary-react';
// import { capitalize } from '../helpers';

const NameLinkStyled = styled.a`
	text-decoration: none;
	color: inherit;
	transition: all 0.5s;

	&:hover {
		color: #9b59b6;
	}
`;

function Header() {
	const username = JSON.parse(
		localStorage.getItem('state')
	).sessionState.authUser.username.toString();
	const role = JSON.parse(
		localStorage.getItem('state')
	).sessionState.authUser.role.toString();

	const CURRENT_USER_INFO = gql`
		{
			findStaffFromUsername(username: "${username}") {
				_id
				firstName
				lastName
				profilePic
			}
			findStudentFromUsername(username: "${username}") {
				_id
				firstName
				lastName
				profilePic
			}
			findTeacherFromUsername(username: "${username}") {
				_id
				firstName
				lastName
				profilePic
			}
		}
	`;

	const dispatch = useDispatch();
	const logout = () => {
		dispatch({ type: actions.SET_AUTH_USER, authUser: null });
		localStorage.removeItem('state');
	};

	const { loading, error, data } = useQuery(CURRENT_USER_INFO);

	function displayCurrentUser(username, role) {
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Error...</p>;

		if (role === 'ADMIN') {
			return (
				<>
					<NameLinkStyled>
						<p id='user-name'>{username}</p>
					</NameLinkStyled>
					<p>{role}</p>
				</>
			);
		}
		if (role === 'STUDENT') {
			return (
				<>
					<NameLinkStyled>
						<p id='user-name'>{username}</p>
					</NameLinkStyled>
					<p>{role}</p>
				</>
			);
		}

		return (
			<>
				<NameLinkStyled href={`/staff/user/${data.findStaffFromUsername._id}`}>
					<p id='user-name'>
						{`${data.findStaffFromUsername.firstName} ${data.findStaffFromUsername.lastName}`}
					</p>
				</NameLinkStyled>
				<p>{data.findStaffFromUsername.__typename.toUpperCase()}</p>
			</>
		);
	}
	return (
		<StyledHeader id='react-no-print'>
			<TimeDay />
			<div className='user-data'>
				{/* {role === 'ADMIN' ? (
					''
				) : (
					<img
						className='avatar'
						src={
							loading || data.findStaffFromUsername.profilePic === null
								? 'https://res.cloudinary.com/imperium/image/upload/v1574791105/nouser.png'
								: data.findStaffFromUsername.profilePic
						}
						alt='User Avatar'
					/>
				)} */}
				{/* {role === 'ADMIN' ? (
					''
				) : (
					<Image
						className='avatar'
						cloudName='imperium'
						publicId={
							loading || data.findStaffFromUsername.profilePic === null
								? 'nouser.png'
								: 'staff_profile_pic/intro-1562178435_y5hnm3.png'
						}
					>
						<Transformation
							gravity='face'
							height='100'
							width='100'
							crop='fill'
						/>
					</Image>
				)} */}
				{displayCurrentUser(username, role)}
				<button onClick={logout} className='logout-btn'>
					logout
				</button>
			</div>
		</StyledHeader>
	);
}

export default Header;

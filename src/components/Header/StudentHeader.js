import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { useDispatch } from 'redux-react-hook';
import * as actions from '../../constants/actions_types';
import StyledHeader from '../styles/StyledHeader';
import TimeDay from '../TimeDay';
import { Image, Transformation } from 'cloudinary-react';
import styled from 'styled-components';

const NameLinkStyled = styled.a`
	text-decoration: none;
	color: inherit;
	transition: all 0.5s;

	&:hover {
		color: #9b59b6;
	}
`;

export default function StudentHeader(props) {
	const CURRENT_USER_INFO = gql`
		{
			findStudentFromUsername(username: "${props.username}") {
				_id
				firstName
				lastName
				profilePic
			}
		}
  `;

	const { loading, error, data } = useQuery(CURRENT_USER_INFO);

	function displayCurrentUser(username, role) {
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Error...</p>;

		return (
			<>
				<NameLinkStyled
					href={`/staff/user/${data.findStudentFromUsername._id}`}
				>
					<p id='user-name'>
						{`${data.findStudentFromUsername.firstName} ${data.findStudentFromUsername.lastName}`}
					</p>
				</NameLinkStyled>
				<p>{data.findStudentFromUsername.__typename.toUpperCase()}</p>
			</>
		);
	}

	const dispatch = useDispatch();
	const logout = () => {
		dispatch({ type: actions.SET_AUTH_USER, authUser: null });
		localStorage.removeItem('state');
	};
	return (
		<StyledHeader id='react-no-print'>
			<TimeDay />
			<div className='user-data'>
				<Image
					className='avatar'
					cloudName='imperium'
					publicId={
						loading || data.findStudentFromUsername.profilePic === null
							? 'nouser.png'
							: data.findStudentFromUsername.profilePic
					}
				>
					<Transformation gravity='face' height='100' width='100' crop='fill' />
				</Image>
				{displayCurrentUser(props.username, props.role)}
				<button onClick={logout} className='logout-btn'>
					logout
				</button>
			</div>
		</StyledHeader>
	);
}

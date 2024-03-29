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
			findTeacherFromUsername(username: "${props.username}") {
				_id
				firstName
				lastName
				profilePic
			}
		}
  `;

	const { loading, error, data } = useQuery(CURRENT_USER_INFO);

	console.log(data);

	function displayCurrentUser(username, role) {
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Error...</p>;

		return (
			<>
				<NameLinkStyled
					href={`/staff/user/${data.findTeacherFromUsername._id}`}
				>
					<p id="user-name">
						{`${data.findTeacherFromUsername.firstName} ${data.findTeacherFromUsername.lastName}`}
					</p>
				</NameLinkStyled>
				<p>{data.findTeacherFromUsername.__typename.toUpperCase()}</p>
			</>
		);
	}

	const dispatch = useDispatch();
	const logout = () => {
		dispatch({ type: actions.SET_AUTH_USER, authUser: null });
		localStorage.removeItem('state');
	};
	console.log(props);
	return (
		<StyledHeader>
			<TimeDay />
			<div className="user-data">
				<Image
					className="avatar"
					cloudName="imperium"
					publicId={
						loading || data.findTeacherFromUsername.profilePic === null
							? 'nouser.png'
							: data.findTeacherFromUsername.profilePic
					}
				>
					<Transformation gravity="face" height="100" width="100" crop="fill" />
				</Image>
				{displayCurrentUser(props.username, props.role)}
				<button onClick={logout} className="logout-btn">
					logout
				</button>
			</div>
		</StyledHeader>
	);
}

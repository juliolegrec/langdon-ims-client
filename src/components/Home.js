import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import axios from 'axios';
import { useDispatch } from 'redux-react-hook';
// import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../constants/actions_types';
import HomeStyled from './styles/StyledHome';

function Login(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const GET_SCHOOL_LOGO = gql`
		{
			schoolInfo {
				logo
			}
		}
	`;

	const { loading: loadingLogo, error: errorLogo, data: dataLogo } = useQuery(
		GET_SCHOOL_LOGO
	);

	if (loadingLogo) {
		return 'Loading...';
	}
	if (errorLogo) {
		return 'Error!';
	}

	const logo = dataLogo.schoolInfo.logo;

	const handleChange = (setter) => (e) => {
		setter(e.target.value);
	};

	const login = async (e) => {
		e.preventDefault();
		setLoading(true);

		const requestBody = {
			query: `
				query {
					login(username:"${username}", password:"${password}") {
						_id
						username
						role
					}
				}
			`,
		};

		// const { data } = await axios.post(
		// 	'https://langdon-ims-server.herokuapp.com/graphql',
		// 	requestBody
		// );
		const { data } = await axios.post(
			'http://localhost:5000/graphql',
			requestBody
		);

		if (data.errors) {
			setError(data.errors[0].message);
			setLoading(false);
		} else {
			setError(null);
			setLoading(false);

			const { _id, username, role } = await data.data.login;

			dispatch({
				type: actions.SET_AUTH_USER,
				authUser: {
					_id,
					username,
					role,
				},
			});

			console.log(data.data.login.role);

			// props.history.push('/home');
			switch (data.data.login.role) {
				case 'ADMIN':
				case 'STAFF':
					props.history.push('/staff');
					break;
				case 'TEACHER':
					props.history.push('/teacher');
					break;
				case 'STUDENT':
					props.history.push('/student');
					break;
				default:
					props.history.push('/');
			}
		}
	};

	return (
		<HomeStyled className='home'>
			<img src={logo} className='App-logo' alt='logo' />
			<div className='login-form'>
				<h1>Login</h1>
				<form onSubmit={login}>
					<label htmlFor='username'>Username</label>
					<input
						type='text'
						id='username'
						className='form-input'
						onChange={handleChange(setUsername)}
						required
					/>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						className='form-input'
						onChange={handleChange(setPassword)}
						required
					/>
					<button type='submit' className='submit-button'>
						{loading ? 'Verifying...' : 'Submit'}
					</button>
					<p className='error-msg'>{error || ''}</p>
				</form>
			</div>
		</HomeStyled>
	);
}

export default withRouter(Login);

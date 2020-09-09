import React, { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedAdminRoute = ({ component: Component, ...rest }) => {
	const mapState = useCallback(
		state => ({
			authUser: state.sessionState.authUser
		}),
		[]
	);

	const { authUser } = useMappedState(mapState);

	return (
		<Route
			{...rest}
			render={props => {
				if (authUser !== null && authUser.role === 'ADMIN') {
					return <Component {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: '/',
								state: {
									from: props.location
								}
							}}
						/>
					);
				}
			}}
		/>
	);
};

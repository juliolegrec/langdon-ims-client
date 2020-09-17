import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from 'react-apollo';
import Home from './Home';
// import Admin from './Admin';
import Staff from './Staff';
import Teacher from './Teacher';
import Student from './Student';
import NotFound from './NotFound';
// import { ProtectedAdminRoute } from './ProtectedAdminRoute';
import { ProtectedStaffRoute } from './ProtectedStaffRoute';
import { ProtectedTeacherRoute } from './ProtectedTeacherRoute';
import { ProtectedStudentRoute } from './ProtectedStudentRoute';

// Instantiate required constructor fields
const cache = new InMemoryCache();

const production = true;

const uploadLink = createUploadLink({
	uri: production
		? 'https://langdon-ims-server.herokuapp.com/graphql'
		: 'http://localhost:5000/graphql',
	headers: {
		'keep-alive': 'true',
	},
});

const defaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'ignore',
	},
	query: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all',
	},
};

const client = new ApolloClient({
	cache,
	link: uploadLink,
	defaultOptions: defaultOptions,
});

const App = () => {
	return (
		<ApolloProvider client={client}>
			<Router>
				<Switch>
					<Route exact path='/' component={Home} />
					{/* <ProtectedAdminRoute path='/staff' component={Staff} /> */}
					<ProtectedStaffRoute path='/staff' component={Staff} />
					<ProtectedTeacherRoute path='/teacher' component={Teacher} />
					<ProtectedStudentRoute path='/student' component={Student} />
					<Route component={NotFound} />
				</Switch>
			</Router>
		</ApolloProvider>
	);
};

export default App;

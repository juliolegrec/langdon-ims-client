import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';

const PrintHeaderStyled = styled.header`
	width: 100vw;
	display: grid;
	grid-template-columns: auto 1fr;

	h1 {
		justify-self: center;
		align-self: center;
	}

	img {
		width: 2.5cm;
	}
`;

export default function PrintHeader(props) {
	const GET_SCHOOL_INFO = gql`
		{
			schoolInfo {
				name
				logo
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_SCHOOL_INFO);

	if (loading) {
		return <h1>Loading...</h1>;
	}

	if (error) {
		return <h1>Error...</h1>;
	}

	return (
		<PrintHeaderStyled>
			<div>
				<img src={data.schoolInfo.logo} alt='School Logo' />
				<h3>{data.schoolInfo.name}</h3>
			</div>
			<h1>{props.pageTitle}</h1>
		</PrintHeaderStyled>
	);
}

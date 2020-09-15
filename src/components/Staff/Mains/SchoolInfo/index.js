import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import LogoPic from './LogoPic';
import styled from 'styled-components';
import StyledMain from '../../styles/MainStyled';

const SettingsFormStyled = styled.form`
	max-width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;

	label {
		display: block;
		margin: 10px 0;

		input,
		select {
			width: 100%;
			height: 30px;
			font-family: 'Source Sans Pro', sans-serif;
			font-size: 1.1rem;
			border: 1px solid #cccccc;
			border-radius: 3px;
			padding-left: 10px;
		}
	}
	button {
		width: 100px;
		margin: 0 auto;
		grid-column-start: 1;
		grid-column-end: 3;
		padding: 10px 15px;
		font-weight: bold;
		border: 1px solid transparent;
		font-size: 1rem;
		background-color: #2ecc71;
		border-radius: 3px;
		color: white;
		cursor: pointer;
	}
`;

const LoadingImage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: white;
	display: flex;
	justify-content: center;
	opacity: 0.75;

	img {
		margin-top: 75px;
	}
`;

export default function SchoolInfo() {
	const GET_SCHOOL_INFO = gql`
		{
			schoolInfo {
				_id
				logo
				name
				streetAddress
				telephoneNumber
				emailAddress
				website
				markingSystem
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_SCHOOL_INFO);
	const [schoolDetails, setSchoolDetails] = useState('');
	const [loadingActive, setLoadingActive] = useState(false);

	useEffect(() => {
		if (data && data.schoolInfo) {
			setSchoolDetails({
				name: data.schoolInfo.name,
				streetAddress: data.schoolInfo.streetAddress,
				telephoneNumber: data.schoolInfo.telephoneNumber,
				emailAddress: data.schoolInfo.emailAddress,
				website: data.schoolInfo.website,
				markingSystem: data.schoolInfo.markingSystem,
			});
		}
	}, [data]);

	const schoolID = data && data.schoolInfo ? data.schoolInfo._id : '';

	const UPDATE_SCHOOL_INFO = gql`
		mutation {
			updateSchoolInfo(
				_id: "${schoolID}"
				name: "${schoolDetails.name}"
				streetAddress: "${schoolDetails.streetAddress}"
				telephoneNumber: "${schoolDetails.telephoneNumber}"
				emailAddress: "${schoolDetails.emailAddress}"
				website: "${schoolDetails.website}"
				markingSystem:${schoolDetails.markingSystem}
			) {
				_id
				name
				streetAddress
			}
		}
	`;

	const [updateSchoolInfo] = useMutation(UPDATE_SCHOOL_INFO, {
		onCompleted: () => {
			window.location.reload();
		},
	});

	if (loading) return <p>Loading ...</p>;

	if (error) return <p>{error.message}</p>;

	return (
		<StyledMain>
			{loadingActive ? (
				<LoadingImage>
					<img
						style={{ position: 'absolute' }}
						src='https://res.cloudinary.com/imperium/image/upload/v1581344084/loading-spinner.gif'
						alt='loading'
					/>
					)
				</LoadingImage>
			) : (
				''
			)}
			<h2>School Info</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '200px 1fr',
					gridGap: '10px',
				}}
			>
				<LogoPic data={data.schoolInfo} />
				<SettingsFormStyled
					onSubmit={(e) => {
						e.preventDefault();
						updateSchoolInfo();
						setLoadingActive(true);
					}}
				>
					{/* <img
					src={
						data && data.schoolInfo
							? data.schoolInfo.logo
							: 'https://via.placeholder.com/150'
					}
					alt='School logo'
					width='150'
				/> */}

					<label>
						Name:
						<input
							type='text'
							value={schoolDetails.name || ''}
							onChange={(e) =>
								setSchoolDetails({ ...schoolDetails, name: e.target.value })
							}
						/>
					</label>
					<label>
						Address:
						<input
							type='text'
							value={schoolDetails.streetAddress || ''}
							onChange={(e) =>
								setSchoolDetails({
									...schoolDetails,
									streetAddress: e.target.value,
								})
							}
						/>
					</label>
					<label>
						Phone Number:
						<input
							type='text'
							value={schoolDetails.telephoneNumber || ''}
							onChange={(e) =>
								setSchoolDetails({
									...schoolDetails,
									telephoneNumber: e.target.value,
								})
							}
						/>
					</label>
					<label>
						Email Address:
						<input
							type='text'
							value={schoolDetails.emailAddress || ''}
							onChange={(e) =>
								setSchoolDetails({
									...schoolDetails,
									emailAddress: e.target.value,
								})
							}
						/>
					</label>
					<label>
						Website:
						<input
							type='text'
							value={schoolDetails.website || ''}
							onChange={(e) =>
								setSchoolDetails({ ...schoolDetails, website: e.target.value })
							}
						/>
					</label>
					{/* <label>
						Marking System:
						<select
							value={schoolDetails.markingSystem || ''}
							onChange={(e) =>
								setSchoolDetails({
									...schoolDetails,
									markingSystem: e.target.value,
								})
							}
						>
							<option value='GRADE'>Grade</option>
							<option value='NUMBER'>Number</option>
						</select>
					</label> */}
					<button type='submit'>Save</button>
				</SettingsFormStyled>
			</div>
		</StyledMain>
	);
}

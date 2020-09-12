import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';

const TimeDayStyled = styled.div`
	font-weight: bold;
	margin: auto 0;

	@media only screen and (max-width: 768px) {
		display: none;
	}
`;

export default function TimeDay() {
	const [time, setTime] = useState(moment().format('D MMM YYYY HH:mm:ss'));

	useEffect(() => {
		setInterval(() => {
			setTime(moment().format('D MMM YYYY HH:mm:ss'));
		}, 1000);
	});

	return <TimeDayStyled>{time}</TimeDayStyled>;
}

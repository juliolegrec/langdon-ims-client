import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StatusStyled = styled.span`
	font-weight: bold;
	text-transform: uppercase;

	&#presentStatus {
		color: #27ae60;
	}

	&#absentStatus {
		color: #e74c3c;
	}
`;

export default function AttendanceStatus(props) {
	const [isAbsent, setIsAbsent] = useState();

	function sendStudentAbsent() {
		if (isAbsent) {
			props.registerAbsentee(props.student);
		}
	}

	// useEffect(() => {
	// 	if (dataAttendance && dataAttendance.studentAttendanceFromDate) {
	// 		const classAbsentees = dataAttendance.studentAttendanceFromDate.absentee.filter(
	// 			(x) => x.classRecorded === props.selectedClass
	// 		);

	// 		if (classAbsentees[0].absentees.indexOf(props.student) === -1) {
	// 			setIsAbsent(false);
	// 		} else if (classAbsentees[0].absentees.indexOf(props.student) !== -1) {
	// 			setIsAbsent(true);
	// 		}
	// 	}
	// }, [dataAttendance, props, isAbsent]);

	useEffect(() => {
		if (props.absentees.indexOf(props.student) === -1) {
			setIsAbsent(false);
		} else if (props.absentees.indexOf(props.student) !== -1) {
			setIsAbsent(true);
		}
	}, [props]);

	// if (loadingAttendance) {
	// 	return <div>Loading...</div>;
	// }

	// if (errorAttendance) {
	// 	return <div>Error!</div>;
	// }

	// if (dataAttendance.studentAttendanceFromDate === null) {
	// 	return <div>No Records...</div>;
	// }

	if (props.isEditable) {
		return (
			<label>
				<input
					type="checkbox"
					checked={isAbsent ? true : false}
					onChange={() => {
						setIsAbsent(!isAbsent);
						sendStudentAbsent();
					}}
				/>{' '}
				&nbsp; Absent
			</label>
		);
	} else {
		return isAbsent ? (
			<StatusStyled id="absentStatus">ABSENT</StatusStyled>
		) : (
			<StatusStyled id="presentStatus">PRESENT</StatusStyled>
		);
	}

	// const attendaceInfo = dataAttendance.studentAttendanceFromDate.absentee;

	// const classRecorded = attendaceInfo.map((x) => x.classRecorded);

	// if (classRecorded.indexOf(props.selectedClass) !== -1) {
	// 	const selectedAttendance = attendaceInfo.filter(
	// 		(x) => x.classRecorded === props.selectedClass
	// 	);

	// 	if (selectedAttendance[0].absentees.length === 0) {
	// 		return <div>PRESENT</div>;
	// 	}

	// if (props.absentees.indexOf(props.student) === -1) {
	// 	return <StatusStyled id="presentStatus">PRESENT</StatusStyled>;
	// } else if (props.absentees.indexOf(props.student) !== -1) {
	// 	return <StatusStyled id="absentStatus">ABSENT</StatusStyled>;
	// }
	// }
}

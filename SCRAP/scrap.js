const UPDATE_ATTENDANCE_STATUS = gql`
    mutation RegisterStudentAttendance($toUpdateStatus: [StudentStatusInput!]!) {
      registerStudentAttendance(
        studentAttendanceInput: {
          dateOfAttendance: "${selectedDate}"
          attendance: $toUpdateStatus
        }
      ) {
        _id
      }
    }
  `;

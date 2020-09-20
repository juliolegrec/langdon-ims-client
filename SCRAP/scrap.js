<MainTimetable>
	<div id='left-column'>
		<h3>Classes List</h3>
		{listClasses()}
	</div>
	<div id='right-column'>
		<div>
			<h3 style={{ textAlign: 'left' }}>CLASS TIMETABLE</h3>
			{isEditable ? (
				<ButtonGroupStyle>
					<button
						id='save-btn'
						style={{ marginRight: '10px' }}
						onClick={() => {
							updateTimetable({
								variables: { toUpdateTimetable: [...updateSubject] },
							});
							setLoadingActive(true);
							setIsEditable(false);
						}}
					>
						SAVE
					</button>
					<button id='cancel-btn' onClick={() => setIsEditable(false)}>
						CANCEL
					</button>
				</ButtonGroupStyle>
			) : (
				<ButtonGroupStyle>
					<button id='edit-btn' onClick={() => setIsEditable(true)}>
						EDIT
					</button>
				</ButtonGroupStyle>
			)}
		</div>
		{displayDataTable()}
	</div>
</MainTimetable>;

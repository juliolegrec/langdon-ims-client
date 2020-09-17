import React, { useState } from 'react';

export default function Checkbox(props) {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<input
			type='checkbox'
			checked={isChecked ? 'checked' : ''}
			value={props.value}
			onChange={(e) => setIsChecked(!isChecked)}
		/>
	);
}

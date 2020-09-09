export const capitalize = (string) => {
	if (typeof string !== 'string') return '';
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const uniquefy = (array, item) => {
	let flags = [],
		output = [];
	for (let i = 0; i < array.length; i++) {
		if (flags[array[i][item]]) continue;
		flags[array[i][item]] = true;
		output.push(array[i][item]);
	}
	return output;
};

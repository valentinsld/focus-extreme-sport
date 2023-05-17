const createBoxes = (text, index) => {
	const node = document.createElement('span');
	node.textContent = text;
	node.classList.add('split-letter');
	node.style.setProperty('--index', index);
	return node;
};

const splitByLetter = text => [ ...text ].map(createBoxes);
const splitByWord = text => text.split(' ').map(createBoxes);

const splitText = text => {
	// txt = txt;
	if (text == null) text = '';
	const out = text.replace(/(^|[ >])([^ ><]+)?/gi, (a, b, c) => {
		let out = b;
		if (c !== undefined) {
			let word = '';
			for (let i = 0, l = c.length; i < l; i++) {
				const v = c[ i ];
				if (v === ' ' || v === ' ' || v === '&nbsp;') word += v;
				else word += `<span class="char char-${ i  + 1}">` + c[ i ] + '</span>';
			}
			out += '<span class="word">' + word + '</span>';
		}
		return out;
	});
	return out;
};

export { splitByLetter, splitByWord, splitText };

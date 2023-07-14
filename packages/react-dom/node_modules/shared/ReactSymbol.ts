export const REACT_ELEMENT_TYPE =
	typeof Symbol === 'function' && Symbol.for
		? Symbol.for('ReactElement')
		: 0xebac;

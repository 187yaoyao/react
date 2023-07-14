import { Props } from 'shared/ReactType';

export type Container = Element;
export type Instance = Element;

export const createInitialInstance = (type: string, props: any): Instance => {
	const element = document.createElement(type);
	return element;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string, ...arg: any): Text => {
	console.log(content, 'content');
	const textNodeElement = document.createTextNode(content);
	return textNodeElement;
};

export const appendChildToContainer = appendInitialChild;

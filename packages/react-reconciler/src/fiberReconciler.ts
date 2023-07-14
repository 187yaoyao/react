/* eslint-disable prettier/prettier */
import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { RootComponent } from './fiberTags';
import { ReactElement } from 'shared/ReactType';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { renderRoot } from './workLoop';

export const createContainer = (container: Container) => {
	const hostRootFiber = new FiberNode(RootComponent, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.stateNode = root;
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
};

export const updateContainer = (element: ReactElement, root: FiberRootNode) => {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElement>(element);
	enqueueUpdate(update, hostRootFiber.updateQueue as UpdateQueue<ReactElement>);
	renderRoot(root);
	// return element;
};

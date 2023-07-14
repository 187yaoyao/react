/* eslint-disable prettier/prettier */
import { Props, Key, Ref, Type, ReactElement } from 'shared/ReactType';
import { FunctionComponent, HostComponent, Tags } from './fiberTags';
import { NoFlags, Flags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	tag: Tags;
	key: Key;
	type: Type;
	pendingProps: Props;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;
	alternate: FiberNode | null;

	memoizedProps: Props;
	memoizedState: any;
	updateQueue: any;

	flags: Flags;
	subTreeFlags: Flags;

	constructor(tag: Tags, pendingProps: Props, key: Key) {
		// 节点
		this.tag = tag;
		this.key = key;
		this.type = null;
		this.stateNode = null;

		// 节点间关系
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;
		this.ref = null;
		this.alternate = null;

		// 状态
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		// 副作用
		this.flags = NoFlags;
		this.subTreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.container = container;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
) => {
	let workInProgress = current.alternate;

	if (workInProgress === null) {
		// mount
		workInProgress = new FiberNode(current.tag, pendingProps, current.key);
		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		// update
		workInProgress.flags = NoFlags;
		workInProgress.pendingProps = pendingProps;
	}
	workInProgress.memoizedProps = current.memoizedProps;
	workInProgress.memoizedState = current.memoizedState;
	workInProgress.stateNode = current.stateNode;
	workInProgress.key = current.key;
	workInProgress.updateQueue = current.updateQueue;
	workInProgress.child = current.child;

	return workInProgress;
};

export const createFiberFromElement = (element: ReactElement) => {
	let fiberTag: Tags = FunctionComponent;

	if (typeof element.type === 'string') {
		fiberTag = HostComponent;
	} else {
		if (__DEV__) {
			console.warn('类型未实现');
		}
	}

	const fiber = new FiberNode(fiberTag, element.props, element.key);
	fiber.type = element.type;
	return fiber;
};

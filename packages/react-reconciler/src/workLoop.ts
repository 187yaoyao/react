/* eslint-disable prettier/prettier */
import { completeWork } from './completeWork';
import { beginWork } from './beginWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostComponent, MutationMask } from './fiberTags';
import { NoFlags } from './fiberFlags';
import { commitMutationOnEffects } from './commitWork';

let workInProgress: FiberNode | null = null;

const prepareFreshStack = (root: FiberRootNode) => {
	workInProgress = createWorkInProgress(root.current, {});
};

export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
	// 调度功能
	const root = markFiberRootNodeByFiber(fiber);
	renderRoot(root);
};

const markFiberRootNodeByFiber = (fiber: FiberNode) => {
	let node = fiber;
	let parent = node.return;

	while (parent != null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostComponent) {
		return node.stateNode;
	}
	return null;
};

export const renderRoot = (root: FiberRootNode) => {
	// 初始化
	prepareFreshStack(root);
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn(`workLoop发生错误`, e);
			}
			workInProgress = null;
		}
	} while (true);
	root.finishedWork = root.current.alternate;
	commitRoot(root);
};

const commitRoot = (root: FiberRootNode) => {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}

	if (__DEV__) {
		console.warn('commit阶段开始');
	}

	root.finishedWork = null;
	const subTreeEffectsOnFiber =
		(finishedWork.subTreeFlags & MutationMask) !== NoFlags;
	const effectOnRootFiber = (finishedWork.flags & MutationMask) != NoFlags;

	if (subTreeEffectsOnFiber || effectOnRootFiber) {
		// beforeMutation
		// mutation
		commitMutationOnEffects(finishedWork);
		// layout
		root.current = finishedWork;
	} else {
		root.current = finishedWork;
	}
};

const workLoop = () => {
	while (workInProgress !== null) {
		preformUnitOfWork(workInProgress);
	}
};

const preformUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber);
	fiber.memoizedProps = workInProgress?.pendingProps;

	if (next == null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
		return;
	}
};

const completeUnitOfWork = (fiber: FiberNode) => {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		if (node.sibling) {
			node = node.sibling;
			workInProgress = node;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
};

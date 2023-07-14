/* eslint-disable prettier/prettier */
import { ReactElement } from 'shared/ReactType';
import { FiberNode } from './fiber';
import { HostComponent, RootComponent, HostText } from './fiberTags';
import { Update, UpdateQueue, progressUpdateQueue } from './updateQueue';
import {
	mountReconcileChildFiber,
	updateReconcileChildFiber
} from './childFiber';
export const beginWork = (workInProgress: FiberNode) => {
	// 没有子节点，比较兄弟节点，深度遍历归阶段
	switch (workInProgress.tag) {
		case HostComponent:
			return updateHostComponent(workInProgress);
		case RootComponent:
			return updateHostRoot(workInProgress);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('未实现的节点类型');
			}
	}
};

const updateHostRoot = (workInProgress: FiberNode): FiberNode | null => {
	// 在mount阶段，先拿到那个element;
	const baseState = workInProgress.memoizedState;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<ReactElement>;
	const pending = updateQueue.shared.pending;
	const { memoizedState } = progressUpdateQueue(baseState, pending);
	updateQueue.shared.pending = null;
	workInProgress.memoizedState = memoizedState;

	const nextChildElement = memoizedState;
	reconcileChildren(workInProgress, nextChildElement);

	return workInProgress.child;
};

const updateHostComponent = (workInProgress: FiberNode): FiberNode | null => {
	const nextChildElement = workInProgress.pendingProps.children;
	reconcileChildren(workInProgress, nextChildElement);
	return workInProgress.child;
};

const reconcileChildren = (
	workInProgress: FiberNode,
	newChildrenElement?: ReactElement
) => {
	const current = workInProgress.alternate;
	if (current) {
		updateReconcileChildFiber(workInProgress, current, newChildrenElement);
	} else {
		mountReconcileChildFiber(workInProgress, null, newChildrenElement);
	}
};

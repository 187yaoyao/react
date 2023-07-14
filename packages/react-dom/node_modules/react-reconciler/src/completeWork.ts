/* eslint-disable prettier/prettier */
import {
	appendInitialChild,
	createTextInstance,
	createInitialInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostText, RootComponent } from './fiberTags';
import { Flags, NoFlags } from './fiberFlags';
export const completeWork = (workInProgress: FiberNode) => {
	// 比较当前ReactElement和fiber,生成副作用并返回字节fiber
	const current = workInProgress.alternate;
	const stateNode = workInProgress.stateNode;
	switch (workInProgress.tag) {
		case HostComponent:
			if (current && stateNode !== null) {
				// update阶段
			} else {
				// mount阶段
				// 1、创建dom
				// 2、将子dom插入当前dom中
				const instance = createInitialInstance(
					workInProgress.type,
					workInProgress.pendingProps
				);
				appendAllChild(instance, workInProgress);
				workInProgress.stateNode = instance;
			}
			bubblingFlags(workInProgress);
			return null;
		case HostText:
			if (current && stateNode !== null) {
				// update阶段
			} else {
				// mount阶段
				// 1、创建dom
				// 2、将子dom插入当前dom中
				const instance = createTextInstance(
					workInProgress.pendingProps.content
				);
				workInProgress.stateNode = instance;
			}
			bubblingFlags(workInProgress);
			return null;
		case RootComponent:
			bubblingFlags(workInProgress);
			return null;
		default:
			if (__DEV__) {
				console.warn('为实现的complete');
			}
	}
};

/**
 *
 * @param parent 递归将子节点的dom插入当前的实例中
 * @param workInProgress
 * @returns
 */
const appendAllChild = (parent: any, workInProgress: FiberNode) => {
	let node = workInProgress.child;
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node = node.child;
			continue;
		}

		if (node == workInProgress) {
			return;
		}

		while (node.sibling === null) {
			if (node?.return === null || node.return == workInProgress) {
				return;
			}
			node = node?.return;
		}

		node = node.sibling;
	}
};

const bubblingFlags = (workInProgress: FiberNode) => {
	let subTreeFlags: Flags = NoFlags;
	let child = workInProgress.child;
	while (child != null) {
		subTreeFlags |= child.subTreeFlags;
		subTreeFlags |= child.flags;
		child = child.sibling;
	}
	workInProgress.subTreeFlags = subTreeFlags;
};

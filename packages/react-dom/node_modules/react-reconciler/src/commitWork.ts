import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { NoFlags, Placement } from './fiberFlags';
import {
	HostComponent,
	HostText,
	MutationMask,
	RootComponent
} from './fiberTags';

/**
 * dfs遍历fiber找到有flags的子fiber
 * @param finishedWork
 */
export const commitMutationOnEffects = (finishedWork: FiberNode) => {
	debugger;
	let nextEffect: FiberNode | null = finishedWork;
	while (nextEffect !== null) {
		const child: FiberNode | null = nextEffect.child;

		if ((nextEffect.subTreeFlags & MutationMask) != NoFlags && child !== null) {
			nextEffect = child;
		} else {
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

/**
 * 通过按位与判断flags类型
 * @param finishedWork
 */
const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	if ((flags & Placement) != NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}

	// update
	// delete
};

/**
 * 将dom节点插入父fiber的dom中
 * @param finishedWork
 */
const commitPlacement = (finishedWork: FiberNode) => {
	const hostParent = findHostParent(finishedWork);
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(hostParent, finishedWork);
	}
};

/**
 * 找到最进的父dom节点
 * @param fiber
 * @returns
 */
const findHostParent = (fiber: FiberNode): Container | null => {
	let parent: FiberNode | null = fiber.return;

	while (parent !== null) {
		if (parent?.tag === HostComponent) {
			return parent.stateNode as Container;
		} else if (parent?.tag === RootComponent) {
			return (parent.stateNode as FiberRootNode)
				.container as unknown as Container;
		} else {
			parent = parent.return;
		}
	}
	if (__DEV__) {
		console.warn('未找到host');
	}
	return null;
};

/**
 * dfs遍历找到最近的子dom节点和他的sibling的dom节点，并插入到container中
 * @param hostParent
 * @param finishedWork
 */
const appendPlacementNodeIntoContainer = (
	hostParent: Container,
	finishedWork: FiberNode
) => {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}

	const child = finishedWork.child;
	while (child !== null) {
		appendPlacementNodeIntoContainer(hostParent, child);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(hostParent, sibling);
			sibling = sibling.sibling;
		}
	}
};

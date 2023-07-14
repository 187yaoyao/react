import { ReactElement } from 'shared/ReactType';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import { HostText } from './fiberTags';
import { Placement } from './fiberFlags';

/* eslint-disable @typescript-eslint/no-empty-function */
const ChildReconciler = (shouldTrackEffect: boolean) => {
	/**
	 * 对需要进行副作用追踪的插入节点加上placement的标记
	 * @param fiber
	 * @returns
	 */
	const placementSingleChild = (fiber: FiberNode) => {
		if (shouldTrackEffect && fiber.alternate === null) {
			debugger;
			fiber.flags |= Placement;
		}
		return fiber;
	};

	/**
	 * 对于 REACT_ELEMENT_TYPE类型的element生成一个fiber节点
	 * @param returnFiber
	 * @param currentFiber
	 * @param currentElement
	 * @returns
	 */
	const reconcileSingleElement = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		currentElement: ReactElement
	) => {
		const fiber = createFiberFromElement(currentElement);
		fiber.return = returnFiber;
		returnFiber.child = fiber;
		return fiber;
	};

	/**
	 * 对于一个文本节点的element生成要给fiber节点
	 * @param returnFiber
	 * @param currentFiber
	 * @param content
	 * @returns
	 */
	const reconcileSingleTextNode = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) => {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		returnFiber.child = fiber;
		return fiber;
	};

	/**
	 * 根据传入的fiber和element生成一个新的fiber节点并返回
	 * @param returnFiber
	 * @param currentFiber
	 * @param currentElement
	 * @returns
	 */
	const reconcileChildFibers = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		currentElement?: ReactElement
	) => {
		if (typeof currentElement === 'object' && currentElement !== null) {
			switch (currentElement.$$type) {
				case REACT_ELEMENT_TYPE:
					return placementSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, currentElement)
					);
				default:
					if (__DEV__) {
						console.warn('类型未实现');
					}
					break;
			}
		}

		if (
			typeof currentElement === 'string' ||
			typeof currentElement === 'number'
		) {
			return placementSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, currentElement)
			);
		}

		if (__DEV__) {
			console.warn('未实现的reconcile类型');
		}
		return null;
	};
	return reconcileChildFibers;
};

export const updateReconcileChildFiber = ChildReconciler(true);
export const mountReconcileChildFiber = ChildReconciler(false);

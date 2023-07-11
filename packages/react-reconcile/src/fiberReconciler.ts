/* eslint-disable prettier/prettier */
import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { RootComponent } from './fiberTags';
import { ReactElement } from 'shared/ReactType';
import { UpdateQueue, createUpdate, enqueueUpdate } from './updateQueue';

export const createContainer = (container: Container) => {
	const hostRootFiber = new FiberNode(RootComponent, {}, null);
    const root = new FiberRootNode(container, hostRootFiber);
    hostRootFiber.stateNode = root;
    return root;
}

export const updateContainer = (
    element: ReactElement,
    root: FiberRootNode
) => {
    const hostRootFiber = root.current;
    const update = createUpdate<ReactElement | null>(element);
    enqueueUpdate(
        update,
        hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>
    );

    // return element;
}
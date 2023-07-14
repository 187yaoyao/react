/* eslint-disable prettier/prettier */
import { Action } from 'shared/ReactType';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null
    }
}

export const createUpdateQueue = <Action>() => {
    return {
        shared: {
            pending: null
        }
    } as UpdateQueue<Action>
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    }
}

export const enqueueUpdate = <State>(
    update: Update<State>,
    updateQueue: UpdateQueue<State>
) => {
    updateQueue.shared.pending = update;
}

export const progressUpdateQueue = <State>(
    baseState: State,
    pendingUpdate: Update<State> | null
): {memoizedState: State} => {
    
    const result: ReturnType<typeof progressUpdateQueue<State>> = {memoizedState: baseState}

    if(pendingUpdate !== null){
        const action = pendingUpdate.action;
        if(action instanceof Function){
            result.memoizedState = action(baseState);
        }else{
            result.memoizedState = action;
        }
    }

    return result;
}
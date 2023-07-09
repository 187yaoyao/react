/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import { Type, Key, ReactElement, Ref, Props } from 'shared/ReactElement';

const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElement {
	const element = {
		$$type: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
		props
    }
	return element;
};

export const jsx = (
    type: Type,
    config: any,
    ...children: any
) => {
    let key: Key = null,
        ref: Ref = null;
    const props: Props = {};

    for(const prop in config){
        if(prop === 'key'){
            if(config[prop] !== void 0){
                key = config[prop];
            }
            continue;
        }
        if(prop === 'ref'){
            if(config[prop] !== void 0){
                ref = config[prop];
            }
            continue;
        }
        if(Object.prototype.hasOwnProperty.call(config,prop)){
            props[prop] = config[prop];
        }
    }

    const childrenElementLength = children.length;
    if(childrenElementLength){
        if(childrenElementLength === 1){
            props.children = children[0];
        }else{
            props.children = children;
        }
    }

    return ReactElement(type,key,ref,props);
}

export const jsxDEV = jsx;
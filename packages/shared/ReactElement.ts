/* eslint-disable @typescript-eslint/no-explicit-any */
export type Type = ElementType;
export type Key = any;
export type Props = any;
export type Ref = any;
export type ElementType = any;

export interface ReactElement {
	type: Type;
	key: Key;
	props: Props;
	ref: Ref;
	$$type: symbol | number;
}

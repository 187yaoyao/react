export type Tags =
	| typeof FunctionComponent
	| typeof HostComponent
	| typeof RootComponent
	| typeof HostText;

export const FunctionComponent = 0;
export const HostComponent = 5;
export const RootComponent = 3;
export const HostText = 6;

import { Container } from 'hostConfig';
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { ReactElement } from 'shared/ReactType';

// ReactDOM.createRoot(root).render(<app/>)
export const createRoot = (container: Container) => {
	const root = createContainer(container);
	return {
		render(element: ReactElement) {
			updateContainer(element, root);
		}
	};
};

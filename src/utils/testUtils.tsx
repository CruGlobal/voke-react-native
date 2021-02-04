import React, { ReactElement, ReactNode } from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore, { MockStore } from 'redux-mock-store';
import { render } from '@testing-library/react-native';
import { ReactTestRendererJSON } from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';

export const createThunkStore = configureStore([thunk]);

interface ContextParams {
  initialState?: Record<string, unknown>;
  store?: MockStore;
  noWrappers?: boolean;
}

const createTestContext = ({
  initialState,
  store = createThunkStore(initialState),
  noWrappers = false,
}: ContextParams = {}) => {
  if (noWrappers) {
    return { wrapper: undefined, store };
  } else {
    return {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      ),
      store,
    };
  }
};

// Inspiration: https://d.pr/cMP1c6
export default function renderWithContext(
  component: ReactElement,
  contextParams: ContextParams = {},
) {
  const { wrapper, store } = createTestContext(contextParams);

  const renderResult = render(React.cloneElement(component), {
    wrapper,
  });

  let storedSnapshot: ReactTestRendererJSON | null;
  return {
    ...renderResult,
    store,
    snapshot: () => expect(renderResult.toJSON()).toMatchSnapshot(),
    recordSnapshot: () => (storedSnapshot = renderResult.toJSON()),
    diffSnapshot: () => {
      if (!storedSnapshot) {
        throw new Error(
          'You must call recordSnapshot to store an initial snapshot before calling diffSnapshot',
        );
      }
      expect(
        snapshotDiff(storedSnapshot, renderResult.toJSON()),
      ).toMatchSnapshot();
    },
  };
}

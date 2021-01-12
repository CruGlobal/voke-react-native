// This file used to store reference to navigation object to be used in any file.
// see: https://reactnavigation.org/docs/navigating-without-navigation-prop/

import * as React from 'react';
import {
  StackActions,
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef: React.RefObject<NavigationContainerRef> = React.createRef();
export const routeNameRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function reset(...args) {
  navigationRef.current?.dispatch(CommonActions.reset(...args));
}

export const insertBeforeLast = (routeName, params) => (state) => {
  const routes = [
    ...state.routes.slice(0, -1),
    { name: routeName, params },
    state.routes[state.routes.length - 1],
  ];

  return CommonActions.reset({
    ...state,
    routes,
    index: routes.length - 1,
  });
};
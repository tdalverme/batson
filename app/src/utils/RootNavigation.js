// RootNavigation.js

import { StackActions, CommonActions } from '@react-navigation/routers';

let navigator;

export const setTopLevelNavigator = navigatorRef => {
  navigator = navigatorRef;
};

export const navigate = routeName => {
  navigator.dispatch(CommonActions.navigate(routeName));
};

export const replace = routeName => {
  navigator.dispatch(StackActions.replace(routeName));
};

// add other navigation functions that you need and export them

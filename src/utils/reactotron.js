/* global __DEV__ */
if (__DEV__) {
  const Reactotron = require('reactotron-react-native').default;
  const { reactotronRedux } = require('reactotron-redux');
  Reactotron
    .configure({
      name: 'Voke App',
    })
    .use(reactotronRedux({
      isActionImportant: (action) => action.type && action.type.indexOf('_SUCCESS') >= 0,
    }))
    .useReactNative({
      asyncStorage: false,
    })
    .useReactNative()
    .connect();
  Reactotron.clear();
}

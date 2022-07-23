import React from 'react';
// import { LogBox } from 'react-native';
import Reactotron, { asyncStorage } from 'reactotron-react-native';
import { Navigation } from './src/Navigation';
import AsyncStorage from '@react-native-community/async-storage';
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../app/src/redux/store/store';
import { reactotronRedux } from 'reactotron-redux';
import { LogBox } from 'react-native';

// LogBox.ignoreLogs(['Reanimated 2', '-[RNCamera ini']);
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

Reactotron.setAsyncStorageHandler?.(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(
    asyncStorage({
      ignore: ['secret'],
    }),
  )
  .use(reactotronRedux())
  .connect(); // let's connect!

const App = () => {
  useEffect(() => {
    admob()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
      });
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;

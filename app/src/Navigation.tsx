import React, { useEffect, useState } from 'react';
import {
  Appearance,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Entypo from 'react-native-vector-icons/Entypo';

import { CameraScreen } from './screens/CameraScreen';
import { ActorPreviewScreen } from './screens/ActorPreviewScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CandidatesActorsScreen } from './screens/CandidatesActorsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { MovieInfoScreen } from './screens/MovieDetailsScreen/MovieInfoScreen';
import { TrailerScreen } from './screens/MovieDetailsScreen/TrailerScreen/TrailerScreen';
import { CastScreen } from './screens/MovieDetailsScreen/CastScreen/CastScreen';
import { CriticsScreen } from './screens/MovieDetailsScreen/CriticsScreen/CriticsScreen';
import { FaqScreen } from './screens/FaqScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_SIZE } from '../assets/fonts/fonts';
import { ActorInfoScreen } from './screens/ActorDetailsScreen/ActorInfoScreen/ActorInfoScreen';
import { ActorFilmographyScreen } from './screens/ActorDetailsScreen/ActorFilmographyScreen/ActorFilmographyScreen';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectColorMode,
  setColorMode,
} from './redux/reducers/colorModeReducer';
import AsyncStorage from '@react-native-community/async-storage';
import { OnBoarding } from './components/OnBoarding';
import { Screen } from './components/Screen';
import * as NavigationActions from './utils/RootNavigation';
import { CandidatesMoviesScreen } from './screens/CandidatesMoviesScreen';
import { MoviePreviewScreen } from './screens/MoviePreviewScreen';
import { ActorInfoTabProvider } from './context/ActorInfoTabContext';
import { MovieTabInfoProvider } from './context/MovieInfoTabContext';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const HomeTabNavigator = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useSelector(selectColorMode);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceDisabled,
        tabBarStyle: {
          paddingTop: top,
          backgroundColor: colors.background,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.small,
        },
      }}>
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Historial',
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Haz un Batson',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ajustes',
        }}
      />
    </Tab.Navigator>
  );
};

const ActorDetailsTabNavigatorRaw = () => {
  const { colors } = useSelector(selectColorMode);

  return (
    <Tab.Navigator
      initialRouteName="ActorInfo"
      backBehavior="initialRoute"
      style={{ backgroundColor: colors.background }}
      screenOptions={{
        tabBarActiveTintColor: colors.onSurfaceHighEmphasis,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
      }}>
      <Tab.Screen
        name="ActorInfo"
        options={{ title: 'Biografía' }}
        component={ActorInfoScreen}
      />
      <Tab.Screen
        name="ActorFilmography"
        options={{ title: 'Películas' }}
        component={ActorFilmographyScreen}
      />
    </Tab.Navigator>
  );
};

const ActorDetailsTabNavigator = () => (
  <ActorInfoTabProvider>
    <ActorDetailsTabNavigatorRaw />
  </ActorInfoTabProvider>
);

const MovieDetailsTabNavigatorRaw = () => {
  const { colors } = useSelector(selectColorMode);
  return (
    <Tab.Navigator
      initialRouteName="MovieInfo"
      backBehavior="initialRoute"
      style={{ backgroundColor: colors.background }}
      screenOptions={{
        tabBarActiveTintColor: colors.onSurfaceHighEmphasis,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
      }}>
      <Tab.Screen
        name="MovieInfo"
        component={MovieInfoScreen}
        options={{ title: 'Sinopsis' }}
      />
      <Tab.Screen
        name="MovieTrailer"
        component={TrailerScreen}
        options={{ title: 'Trailer' }}
      />
      <Tab.Screen
        name="MovieReparto"
        component={CastScreen}
        options={{ title: 'Reparto' }}
      />
      <Tab.Screen
        name="MovieCritics"
        component={CriticsScreen}
        options={{ title: 'Criticas' }}
      />
    </Tab.Navigator>
  );
};

const MovieDetailsTabNavigator = () => (
  <MovieTabInfoProvider>
    <MovieDetailsTabNavigatorRaw />
  </MovieTabInfoProvider>
);

const RightIcon = () => {
  const navigation = useNavigation() as any;
  const { colors } = useSelector(selectColorMode);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Home');
      }}>
      <Entypo name="home" size={23} color={colors.onSurfaceHighEmphasis} />
    </TouchableOpacity>
  );
};

const BatsonTheme = {
  DARK: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: 'transparent',
    },
  },
  LIGHT: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  },
};

export const Navigation = () => {
  const { colors, mode } = useSelector(selectColorMode);
  const [showOnBoarding, setShowOnBoarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const firstTimePromise = AsyncStorage.getItem('first_time').then(value => {
      if (value) {
        setShowOnBoarding(false);
      } else {
        setShowOnBoarding(true);
      }
    });
    const themePromise = AsyncStorage.getItem('theme').then(theme => {
      if (!theme) {
        if (Appearance.getColorScheme() === 'dark') {
          dispatch(setColorMode('DARK'));
        } else {
          dispatch(setColorMode('LIGHT'));
        }
      } else {
        dispatch(setColorMode(theme as 'DARK' | 'LIGHT'));
      }
    });
    Promise.all([firstTimePromise, themePromise]).finally(() => {
      setLoading(false);
    });
  }, []);

  const statusBar = (
    <StatusBar
      translucent={true}
      backgroundColor={'transparent'}
      barStyle={mode === 'DARK' ? 'light-content' : 'dark-content'}
    />
  );

  if (loading) {
    return (
      <Screen loading>
        {statusBar}
        <View />
      </Screen>
    );
  }

  return (
    <NavigationContainer
      theme={BatsonTheme[mode]}
      ref={ref => {
        NavigationActions.setTopLevelNavigator(ref);
      }}>
      {statusBar}
      <Stack.Navigator
        initialRouteName={showOnBoarding ? 'OnBoarding' : 'HomeTab'}
        screenOptions={{
          headerBackTitleVisible: false,
          headerLeftContainerStyle: {
            paddingLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
          headerRightContainerStyle: {
            paddingRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
          gestureEnabled: false,
          headerTintColor: colors.onSurfaceHighEmphasis,
          title: '',
          headerTitleAlign: 'center',
          headerBackground: () => (
            <View
              style={[
                styles.headerBackground,
                { backgroundColor: colors.background },
              ]}
            />
          ),
          headerRight: () => <RightIcon />,
          cardOverlay: () => (
            <View
              style={{
                ...styles.cardOverlay,
                backgroundColor: colors.background,
              }}
            />
          ),
        }}>
        <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTab"
          component={HomeTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Reconoce películas' }}
        />
        <Stack.Screen
          name="ActorPreviewScreen"
          component={ActorPreviewScreen}
          options={{ title: 'Vista Previa' }}
        />
        <Stack.Screen
          name="MoviePreviewScreen"
          component={MoviePreviewScreen}
          options={{ title: 'Vista Previa' }}
        />
        <Stack.Screen
          name="CandidatesActorsScreen"
          component={CandidatesActorsScreen}
          options={{
            title: 'Resultados de tu Batson',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="CandidatesMoviesScreen"
          component={CandidatesMoviesScreen}
          options={{
            title: 'Resultados de tu Batson',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="MovieDetails"
          options={{
            title: 'Detalles',
            headerTitleAlign: 'center',
          }}
          component={MovieDetailsTabNavigator}
        />
        <Stack.Screen
          name="ActorDetails"
          options={{
            title: 'Detalles',
            headerTitleAlign: 'center',
          }}
          component={ActorDetailsTabNavigator}
        />
        <Stack.Screen
          name="Faq"
          component={FaqScreen}
          options={{
            title: 'Preguntas Frecuentes',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
  },
  cardOverlay: {
    flex: 1,
  },
});

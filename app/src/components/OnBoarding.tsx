import React, { useRef } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OnBoardingSlide } from './OnBoardingSlide';
import { Screen } from './Screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PageIndicator from './PageIndicator';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../redux/reducers/colorModeReducer';

export enum IMAGES {
  batson = require('../../assets/images/onboarding_1.png'),
  movies = require('../../assets/images/onboarding_2.png'),
  actors = require('../../assets/images/onboarding_3.png'),
  history = require('../../assets/images/onboarding_4.png'),
}

const slides = [
  {
    id: 1,
    image: IMAGES.batson,
    title: 'Bienvenido a Batson',
    description: 'Batson puede reconocer +500 actores y +1000 películas.',
  },
  {
    id: 2,
    image: IMAGES.movies,
    title: 'Reconoce películas',
    description:
      'Encuentra la película que estás buscando con solo tomar un video de la misma.',
  },
  {
    id: 3,
    image: IMAGES.actors,
    title: 'Reconoce actores',
    description:
      'Obtén información acerca del actor que estás buscando con solo tomarle una foto.',
  },
  {
    id: 4,
    image: IMAGES.history,
    title: 'Guarda tus Batsons',
    description:
      'Consulta tus Batsons en cualquier momento desde tu historial.',
  },
];

export const OnBoarding = ({ navigation }: any) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { colors } = useSelector(selectColorMode);

  const handleDone = () => {
    AsyncStorage.setItem('first_time', 'false');
    navigation.replace('HomeTab', { screen: 'Home' });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.slidesContainer}>
          <FlatList
            data={slides}
            renderItem={({ item }) => <OnBoardingSlide {...item} />}
            keyExtractor={item => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            scrollEventThrottle={64}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleDone}
            style={[
              styles.buttonContainer,
              { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={18}
                color={colors.onPrimaryMediumEmphasis}
              />
              <Text
                style={[
                  styles.saveText,
                  { color: colors.onPrimaryMediumEmphasis },
                ]}>
                COMENZAR
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.pageIndicatorContainer}>
          <PageIndicator data={slides} scrollX={scrollX} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidesContainer: {
    flex: 0.65,
  },
  buttonWrapper: {
    flex: 0.15,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: 250,
    borderRadius: 43,
    borderWidth: 1.5,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    elevation: 8,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  saveText: {
    marginLeft: 12,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    letterSpacing: 2,
  },
  pageIndicatorContainer: {
    marginTop: 20,
    justifyContent: 'center',
  },
});

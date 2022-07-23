import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { ERROR_IMAGES } from '../../../components/ErrorPopup';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import { Actor, Movie } from '../hooks/useSearch';
import { SearchCard } from './SearchCard';

type TResults = {
  loading: boolean;
  data: null | (Actor | Movie)[];
  hasError: boolean;
};

export const Results = ({ loading, data, hasError }: TResults) => {
  const navigation = useNavigation() as any;
  const { colors } = useSelector(selectColorMode);

  if (loading) {
    return (
      <View style={styles.containerFullScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (hasError) {
    return (
      <>
        <Image source={ERROR_IMAGES.noConnection} style={styles.errorImage} />

        <Text
          style={[
            styles.errorTitle,
            { color: colors.onSurfaceMediumEmphasis },
          ]}>
          Error de conexión
        </Text>
      </>
    );
  }

  if (!data || data.length < 0) {
    return (
      <View style={styles.containerFullScreen}>
        <Text
          style={[
            styles.errorTitle,
            { color: colors.onSurfaceMediumEmphasis },
          ]}>
          Obtené la información de tus películas y actores favoritos con Batson
        </Text>
      </View>
    );
  }

  if (data?.length > 0) {
    return (
      <FlatList
        style={styles.resultsContainer}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            delayPressIn={30}
            onPress={() => {
              if (item.resultType === 'Name') {
                navigation.navigate('ActorDetails', {
                  screen: 'ActorInfo',
                  params: { actorId: item.id },
                });
              } else {
                navigation.navigate('MovieDetails', {
                  screen: 'MovieInfo',
                  params: {
                    movieID: item.id,
                  },
                });
              }
            }}>
            <SearchCard data={item} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }
  return null;
};

export default Results;
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  containerFullScreen: {
    flex: 1,
    position: 'absolute',
    top: 150,
    paddingHorizontal: 40,
    width: '100%',
  },
  resultsContainer: {
    width: '100%',
    marginTop: 115,
    paddingHorizontal: 10,
  },
  errorImage: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  errorTitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.large,
    textAlign: 'center',
  },
});

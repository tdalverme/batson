import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { Screen } from '../../../components/Screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { StarRating } from './components/StarRating';
import { useDispatch, useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import StreamingIcon from './components/StreamingIcon';
import {
  selectMovieBatson,
  setCorrectMovie,
} from '../../../redux/reducers/movieBatsonSlice';
import { ErrorPopup, ERROR_IMAGES } from '../../../components/ErrorPopup';
import { MovieTabInfoContext } from '../../../context/MovieInfoTabContext';

export const MovieInfoScreen = ({ route, navigation }: any) => {
  const { colors } = useSelector(selectColorMode);
  const dispatch = useDispatch();

  const {
    hasError,
    movieTabInfo,
    loading,
    fetchMovieTabInfo,
    setMovieTabInfo,
  } = useContext(MovieTabInfoContext);
  const { correctBatsonMovie, currentMovie } = useSelector(selectMovieBatson);

  const { movieID, readonly: readonlyParam } = route?.params || {};
  const readonly = readonlyParam ?? true;
  const [textShown, setTextShown] = useState(false);

  const isCorrectMovie =
    correctBatsonMovie?.id && movieTabInfo?.id === correctBatsonMovie.id;

  const onPressText = () => {
    setTextShown(!textShown);
  };

  const handleCorrect = () => {
    if (!isCorrectMovie && movieTabInfo) {
      dispatch(setCorrectMovie(movieTabInfo));
    } else {
      dispatch(setCorrectMovie(null));
    }
  };

  useEffect(() => {
    if (movieID) {
      fetchMovieTabInfo(movieID);
    } else {
      setMovieTabInfo(currentMovie);
    }
  }, [movieID]);

  return (
    <Screen loading={loading} style={styles.container}>
      <ErrorPopup
        visible={hasError}
        title="No hay coincidencias"
        description="No encontramos ninguna coincidencia. Intenta más tarde nuevamente"
        image={ERROR_IMAGES.noResults}
        buttonDescription="VOLVER"
        onClose={(closeModal) =>{ 
          closeModal();
          navigation.goBack();
        }}
      />
      <ImageBackground
        source={{ uri: movieTabInfo?.image }}
        style={styles.poster}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.2, 0.35, 0.8]}
          colors={
            textShown ? colors.textShownGradient : colors.textHiddenGradient
          }
          style={styles.gradientContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.firstRowContainer}>
              <Text
                style={[styles.title, { color: colors.onSurfaceHighEmphasis }]}
                numberOfLines={2}
                adjustsFontSizeToFit>
                {movieTabInfo?.title}
              </Text>
              {!readonly && (
                <View style={styles.trophyContainer}>
                  <TouchableOpacity
                    onPress={handleCorrect}
                    style={[
                      styles.trophyIconContainer,
                      { backgroundColor: colors.surface_dp1 },
                      !!isCorrectMovie && {
                        borderColor: colors.primary,
                        ...styles.correctMovie,
                      },
                    ]}>
                    <MaterialCommunityIcons
                      name="trophy"
                      size={28}
                      color={
                        isCorrectMovie
                          ? colors.primary
                          : colors.onSurfaceDisabled
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.secondRowContainer}>
              <View style={styles.relevantInfoContainer}>
                {movieTabInfo && movieTabInfo.genreList[0] && (
                  <Text
                    style={[
                      styles.relevantInfo,
                      { color: colors.onSurfaceMediumEmphasis },
                    ]}>
                    {movieTabInfo?.year} ‧ {movieTabInfo.genreList[0].value} ‧{' '}
                    {movieTabInfo
                      ? Math.floor(movieTabInfo?.runtimeMins / 60)
                      : 0}
                    h{' '}
                    {movieTabInfo
                      ? Math.floor(movieTabInfo?.runtimeMins % 60)
                      : 0}
                    m
                  </Text>
                )}
              </View>
              <View style={styles.starsContainer}>
                <StarRating
                  rating={movieTabInfo ? movieTabInfo.imDbRating / 2 : 0}
                  size={'medium'}
                />
              </View>
            </View>
            <View>
              <Text
                style={[
                  styles.description,
                  { color: colors.onSurfaceMediumEmphasis },
                ]}
                onPress={() => onPressText()}
                numberOfLines={textShown ? 36 : 4}>
                {movieTabInfo?.plotLocal
                  ? movieTabInfo.plotLocal
                  : movieTabInfo?.plot}
              </Text>
            </View>

            <View style={styles.streamingContainer}>
              {movieTabInfo?.streamings?.streamingInfo.netflix && (
                <StreamingIcon
                  streamingName={'netflix'}
                  style={styles.streamingIcon}
                  movieLink={
                    movieTabInfo?.streamings.streamingInfo.netflix.ar.link
                  }
                />
              )}
              {movieTabInfo?.streamings?.streamingInfo.disney && (
                <StreamingIcon
                  streamingName={'disney'}
                  style={styles.streamingIcon}
                  movieLink={
                    movieTabInfo?.streamings.streamingInfo.disney.ar.link
                  }
                />
              )}
              {movieTabInfo?.streamings?.streamingInfo.hbo && (
                <StreamingIcon
                  streamingName={'hbo'}
                  style={styles.streamingIcon}
                  movieLink={movieTabInfo?.streamings.streamingInfo.hbo.ar.link}
                />
              )}
              {movieTabInfo?.streamings?.streamingInfo.prime && (
                <StreamingIcon
                  streamingName={'prime'}
                  style={styles.streamingIcon}
                  movieLink={
                    movieTabInfo?.streamings.streamingInfo.prime.ar.link
                  }
                />
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  correctMovie: {
    borderWidth: 3,
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: 19,
    paddingBottom: 35,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  firstRowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.extra_large,
    flex: 0.85,
    paddingRight: 13,
  },
  trophyContainer: {
    flex: 0.15,
  },
  trophyIconContainer: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 55,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 8,
  },
  secondRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  relevantInfoContainer: {
    flex: 0.8,
  },
  relevantInfo: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.medium,
  },
  starsContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  description: {
    fontFamily: FONTS.light,
    fontSize: FONT_SIZE.medium,
    lineHeight: 23,
    textAlign: 'justify',
  },
  streamingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  streamingIcon: {
    marginRight: 15,
  },
});

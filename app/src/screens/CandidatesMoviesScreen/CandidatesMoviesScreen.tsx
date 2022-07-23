import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Screen } from '../../components/Screen';
import { MovieCard } from './components/MovieCard';
import { preventDoubleClick } from '../../utils/preventDoubleClick';
import { useDispatch, useSelector } from 'react-redux';
import { selectColorMode } from '../../redux/reducers/colorModeReducer';
import {
  selectMovieBatson,
  setCurrentMovie,
} from '../../redux/reducers/movieBatsonSlice';
import { Movie } from '../../services/movies';

export const STORAGE_KEY = 'batsons';

export const CandidatesMoviesScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { colors } = useSelector(selectColorMode);
  const readonly = route?.params?.readonly ?? true;
  const currentBatson = useSelector(selectMovieBatson);

  const { candidates, correctBatsonMovie } = currentBatson;

  const handleSaveBatson = async () => {
    try {
      const batsons_hist = JSON.parse(
        (await AsyncStorage.getItem(STORAGE_KEY)) || 'null',
      ) as Movie[][] | null;

      if (batsons_hist !== null) {
        AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([
            ...batsons_hist,
            correctBatsonMovie ? [correctBatsonMovie] : candidates,
          ]),
        );
      } else {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([
            correctBatsonMovie ? [correctBatsonMovie] : candidates,
          ]),
        );
      }
    } catch (e) {
      console.log(e, 'Error con el asyncStorage');
    }
    navigation.navigate('Home');
  };

  const handlePressBatson = (item: Movie) => {
    dispatch(setCurrentMovie(item));
    navigation.navigate('MovieDetails', {
      screen: 'MovieInfo',
      params: { readonly },
    });
  };

  const sortedResults = candidates
    ?.slice(0, 10)
    ?.sort((a, b) => b.coincidence - a.coincidence);

  return (
    <Screen style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.candidatesListWrapper}>
        <FlatList
          data={sortedResults}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              delayPressIn={30}
              onPress={() => handlePressBatson(item)}>
              <MovieCard
                index={index}
                {...item}
                correct={item.id === correctBatsonMovie?.id}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => (item.type === 'movie' ? item.id : item.title)}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {!readonly && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => preventDoubleClick(handleSaveBatson)}
            style={[
              styles.fabWrapper,
              { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}>
            <View style={styles.fabContent}>
              <MaterialCommunityIcons
                name="content-save"
                size={18}
                color={colors.onPrimaryMediumEmphasis}
              />
              <Text
                style={[
                  styles.saveText,
                  { color: colors.onPrimaryMediumEmphasis },
                ]}>
                GUARDAR BATSON
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  candidatesListWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 36,
    flex: 1,
  },
  footerContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 25,
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
  fabContent: {
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
});

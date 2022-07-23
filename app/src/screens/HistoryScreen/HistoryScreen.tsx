import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FONTS, FONT_SIZE } from '../../../assets/fonts/fonts';
import { Screen } from '../../components/Screen';
import { FlatList } from 'react-native-gesture-handler';
import { STORAGE_KEY } from '../CandidatesActorsScreen/CandidatesActorsScreen';
import { HistoryCard } from './components/HistoryCard';
import {
  SortButton,
  sortByGenre,
  sortByRecent,
  sortByRelease,
  sortByTitle,
} from './components/SortButton';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectColorMode } from '../../redux/reducers/colorModeReducer';
import { Movie } from '../../services/movies';
import {
  setCandidatesMovies,
  setCurrentMovie,
} from '../../redux/reducers/movieBatsonSlice';

export const HistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const [historyList, setHistoryList] = useState<Movie[][] | null>(null);
  const [sortSelected, setSortSelected] = useState('');
  const filters = ['Reciente', 'Estreno', 'Título', 'Género'];
  const [isLongPressed, setLongPressed] = useState(false);

  const { colors } = useSelector(selectColorMode);

  const handleRemove = (index = -1) => {
    if (index === -1) {
      Alert.alert(
        'Limpiar Historial',
        '¿Estás seguro de querer eliminar todos los batsons?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Aceptar', onPress: () => eliminarBatson(index) },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        'Eliminar Batson',
        '¿Estás seguro de querer eliminar este batson?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Aceptar', onPress: () => eliminarBatson(index) },
        ],
        { cancelable: false },
      );
    }
  };

  const saveHistory = async (newBatsons: Movie[][]) => {
    try {
      if (newBatsons !== null) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBatsons));
      }
    } catch (e) {
      console.log('Error con el asyncStorage');
    }
  };

  const vaciar = async () => {
    try {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.log('Error con el asyncStorage');
    }
  };

  const eliminarBatson = (indexB: number) => {
    if (indexB === -1) {
      setHistoryList(null);
      vaciar();
      setLongPressed(false);
    } else {
      const newBatsons = historyList?.filter((_, index) => indexB !== index);
      if (newBatsons) {
        setHistoryList(newBatsons);
        saveHistory(newBatsons);
      }
    }
  };

  const sortFunctions = {
    byRecent: sortByRecent,
    byTitle: sortByTitle,
    byRelease: sortByRelease,
    byGenre: sortByGenre,
  };

  const handlePressHistoryCard = (batsons: Movie[]) => {
    if (isLongPressed) {
      setLongPressed(false);
    } else {
      if (batsons.length === 1) {
        dispatch(setCurrentMovie(batsons[0]));
        navigation.navigate('MovieDetails', {
          screen: 'MovieInfo',
        });
      } else {
        dispatch(setCandidatesMovies(batsons));
        navigation.navigate('CandidatesMoviesScreen');
      }
    }
  };

  const getBatsonsHistory = async () => {
    try {
      const batsons_hist = JSON.parse(
        (await AsyncStorage.getItem(STORAGE_KEY)) || 'null',
      ) as Movie[][];
      if (batsons_hist !== null) {
        setHistoryList(batsons_hist);
      } else {
        setHistoryList(null);
      }
    } catch (e) {
      setHistoryList(null);
    }
  };

  const onFocus = useCallback(() => {
    setLongPressed(false);
    getBatsonsHistory();
  }, []);

  useEffect(() => {
    getBatsonsHistory();
    return navigation.addListener('focus', () => onFocus());
  }, [navigation, onFocus]);

  return (
    <Screen>
      {historyList && historyList?.length > 0 ? (
        <>
          {!isLongPressed && (
            <View style={styles.sortContainer}>
              <View style={styles.sortButtonContainer}>
                <FlatList
                  data={filters}
                  renderItem={({ item, index }) => (
                    <SortButton
                      text={item}
                      style={
                        index === 0
                          ? { ...styles.sortButton, marginLeft: 20 }
                          : styles.sortButton
                      }
                      selected={sortSelected}
                      batsons={historyList}
                      onPress={() => {
                        let sorted;
                        switch (item) {
                        case 'Reciente':
                          sorted = sortFunctions.byRecent(historyList);
                          setHistoryList(JSON.parse(JSON.stringify(sorted)));
                          setSortSelected('Reciente');
                          break;

                        case 'Estreno':
                          sorted = sortFunctions.byRelease(historyList);
                          setHistoryList(JSON.parse(JSON.stringify(sorted)));
                          setSortSelected('Estreno');
                          break;

                        case 'Título':
                          sorted = sortFunctions.byTitle(historyList);
                          setHistoryList(JSON.parse(JSON.stringify(sorted)));
                          setSortSelected('Título');
                          break;

                        case 'Género':
                          sorted = sortFunctions.byGenre(historyList);
                          setHistoryList(JSON.parse(JSON.stringify(sorted)));
                          setSortSelected('Género');
                          break;
                        }
                      }}
                    />
                  )}
                  keyExtractor={item => item}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                />
              </View>
            </View>
          )}

          <View style={styles.cardsContainer}>
            <FlatList
              data={historyList}
              renderItem={({ item, index }) => {
                const result = item as Movie[];
                const subtitle = `${result[0].year} ‧ ${
                  result[0].genreList?.[0]?.value
                } ‧ ${Math.floor(result[0].runtimeMins / 60)}h ${Math.floor(
                  result[0].runtimeMins % 60,
                )}m`;
                return (
                  <HistoryCard
                    isLongPressed={isLongPressed}
                    {...result[0]}
                    subtitle={subtitle}
                    cardStyle={styles.cardStyle}
                    onPress={() => handlePressHistoryCard(item)}
                    onLongPress={() => setLongPressed(true)}
                    onRemove={() => handleRemove(index)}
                  />
                );
              }}
              keyExtractor={(_result, index) => String(index)}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapperStyle}
            />
          </View>
          {isLongPressed && (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                onPress={() => handleRemove()}
                style={[
                  styles.clearWrapper,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}>
                <View style={styles.fabContent}>
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={18}
                    color={colors.onPrimaryMediumEmphasis}
                  />
                  <Text style={styles.saveText}>LIMPIAR HISTORIAL</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View
          style={[
            styles.emptyStateContainer,
            { backgroundColor: colors.background },
          ]}>
          <Image
            source={require('../../../assets/images/empty-state.png')}
            style={styles.emptyStateImg}
          />

          <View style={styles.emptyStateTextContainer}>
            <Text
              style={[
                styles.emptyStateTitle,
                { color: colors.onSurfaceMediumEmphasis },
              ]}>
              Tu historial está vacío
            </Text>
            <Text
              style={[
                styles.emptyStateDescription,
                { color: colors.onSurfaceMediumEmphasis },
              ]}>
              Guarda un Batson para volver a consultar sus detalles en otro
              momento.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Camera')}
            style={[
              styles.batsonWrapper,
              { borderColor: colors.primary, backgroundColor: colors.primary },
            ]}>
            <View style={styles.fabContent}>
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
                HACER UN BATSON
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateImg: {
    resizeMode: 'contain',
    height: 220,
    opacity: 1,
  },
  emptyStateTextContainer: {
    width: '80%',
    maxWidth: 300,
    paddingBottom: 50,
  },
  emptyStateTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.semi_large,
    textAlign: 'center',
    lineHeight: 25,
  },
  emptyStateDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    textAlign: 'center',
    lineHeight: 22,
    paddingTop: 10,
  },
  footerContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sortContainer: {
    paddingTop: 20,
    width: '100%',
    overflow: 'visible',
  },
  clearWrapper: {
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
  batsonWrapper: {
    borderRadius: 43,
    borderWidth: 1.5,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
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
  sortButtonContainer: {
    paddingBottom: 15,
  },
  firstSortButton: {
    marginRight: 10,
    marginLeft: 20,
  },
  sortButton: {
    marginRight: 12,
  },
  cardsContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  cardStyle: { width: '48%' },
  columnWrapperStyle: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

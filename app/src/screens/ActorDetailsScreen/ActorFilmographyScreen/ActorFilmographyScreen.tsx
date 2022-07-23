import React, { useContext } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FilmographyCard } from './components/FilmographyCard';
import { Screen } from '../../../components/Screen';
import { ActorInfoTabContext } from '../../../context/ActorInfoTabContext';

export const ActorFilmographyScreen = ({ navigation }: any) => {
  const { actorInfo } = useContext(ActorInfoTabContext);
  return (
    <Screen>
      <View style={styles.candidatesListWrapper}>
        <FlatList
          data={actorInfo?.castMovies?.filter(
            movie => (movie.role === 'Actor' || movie.role === 'Actress') && !!movie.year,
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              delayPressIn={30}
              onPress={() => {
                navigation.push('MovieDetails', {
                  screen: 'MovieInfo',
                  params: {
                    movieID: item.id,
                  },
                });
              }}>
              <FilmographyCard {...item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
});

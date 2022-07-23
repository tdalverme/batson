import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View, FlatList } from 'react-native';
import { Screen } from '../../components/Screen';
import { MovieCard } from './components/MovieCard';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../redux/reducers/colorModeReducer';
import { selectActorBatson } from '../../redux/reducers/actorBatsonSlice';
import { Actor } from '../../services/actors';

export const STORAGE_KEY = 'batsons';

export const CandidatesActorsScreen = ({ navigation }: any) => {
  const currentBatson = useSelector(selectActorBatson);
  const { candidates, fetchingActorsCandidates, error } = currentBatson;

  const { colors } = useSelector(selectColorMode);

  if (error) {
    navigation.navigate('Home');
    return null;
  }

  const handleActorCandidate = (item: Actor) => {
    navigation.navigate('ActorDetails', {
      screen: 'ActorInfo',
      params: { actorId: item.id },
    });
  };

  let sortedResults = [] as Actor[];
  sortedResults = candidates?.slice(0, 10) as Actor[];
  if (sortedResults?.length < 0) {
    return null;
  }

  return (
    <Screen
      style={[styles.container, { backgroundColor: colors.background }]}
      loading={fetchingActorsCandidates}>
      <View style={styles.candidatesListWrapper}>
        <FlatList
          data={sortedResults}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              delayPressIn={30}
              onPress={() => handleActorCandidate(item)}>
              <MovieCard index={index} {...item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.title}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
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

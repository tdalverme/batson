import React, { useContext } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Screen } from '../../../components/Screen';
import { MovieTabInfoContext } from '../../../context/MovieInfoTabContext';
import { CastCard } from './components/CastCard';

export const CastScreen = ({ navigation }: any) => {
  const { movieTabInfo } = useContext(MovieTabInfoContext);

  const handlePressActorCard = (actorId: string) => {
    navigation.push('ActorDetails', {
      screen: 'ActorInfo',
      params: {
        actorId: actorId,
      },
    });
  };

  return (
    <Screen>
      <FlatList
        data={movieTabInfo?.actorList.slice(0, 15)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            delayPressIn={30}
            onPress={() => handlePressActorCard(item.id)}>
            <CastCard data={item} index={index} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

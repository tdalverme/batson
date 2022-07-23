import React, { useContext } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Linking,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { Screen } from '../../../components/Screen';
import { MovieTabInfoContext } from '../../../context/MovieInfoTabContext';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import { CriticCard } from './components/CriticCard';

export const CriticsScreen = () => {
  const { colors } = useSelector(selectColorMode);
  const { movieTabInfo } = useContext(MovieTabInfoContext);

  const handlePressCriticCard = (reviewLink: string) => {
    Linking.openURL(reviewLink);
  };

  return (
    <Screen>
      {movieTabInfo?.critics ? (
        <FlatList
          data={movieTabInfo?.critics.slice(0, 15)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              delayPressIn={30}
              onPress={() => handlePressCriticCard(item.reviewLink)}>
              <CriticCard data={item} index={index} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.reviewLink}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.container}>
          <Text
            style={[
              styles.errorMessage,
              { color: colors.onSurfaceHighEmphasis },
            ]}>
            No hay críticas disponibles.
          </Text>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
  },
});

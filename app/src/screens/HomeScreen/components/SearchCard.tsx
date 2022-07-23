import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import { Actor, Movie } from '../hooks/useSearch';

type TResultCard = {
  data: Actor | Movie;
};

export const SearchCard = ({ data }: TResultCard) => {
  const { colors } = useSelector(selectColorMode);

  return data.resultType === 'Name' ? (
    <View style={styles.resultItemWrapper}>
      <Image source={{ uri: data.image }} style={styles.actorImage} />

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={[styles.titleText, { color: colors.onSurfaceHighEmphasis }]}
            numberOfLines={1}>
            {data.title}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text
            style={[
              styles.detailsText,
              { color: colors.onSurfaceMediumEmphasis },
            ]}>
            Actor
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.resultItemWrapper}>
      <Image source={{ uri: data.image }} style={styles.movieImage} />

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={[styles.titleText, { color: colors.onSurfaceHighEmphasis }]}
            numberOfLines={1}>
            {data.title}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text
            style={[
              styles.detailsText,
              { color: colors.onSurfaceMediumEmphasis },
            ]}>
            Película
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultItemWrapper: {
    flex: 1,
    marginBottom: 30,
    flexDirection: 'row',
  },
  actorImage: {
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  movieImage: {
    width: 90,
    height: 90,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 30,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.semi_large,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.small,
  },
});
